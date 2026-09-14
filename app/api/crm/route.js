// app/api/crm/route.js
//
// Sync endpoint for the Advon CRM (public/crm/index.html).
//
// The server NEVER sees plaintext client data. The browser encrypts with
// AES-256-GCM before sending; this route only stores and returns the opaque
// {iv, ct} blob. Losing this endpoint, the storage repo, or the token does not
// expose client records — only the passphrase can decrypt them.
//
// Storage backend: a PRIVATE GitHub repo, written through the Contents API.
// Every write is ONE git commit (data + hourly snapshot + old-snapshot prunes, see
// lib/ghdata.js), so history is durable and recoverable and saves never race each other.
//
// Required environment variables. Set these on the host that actually serves
// advonmedia.com, which is NETLIFY:
//   Netlify → your site → Site configuration → Environment variables
// (A Vercel project also builds this repo, but it does not serve the live domain.)
//   CRM_GH_TOKEN   fine-grained GitHub PAT with Contents: read & write on the data repo
//   CRM_GH_REPO    "owner/repo" of the PRIVATE data repo, e.g. "agelmet/advon-crm-data"
//   CRM_GH_BRANCH  optional, defaults to "main"
//   CRM_AUTH_HASH  hex SHA-256 of the sync token the browser derives from your
//                  passphrase. The CRM shows you this value under Sync setup.
//                  The passphrase itself is never stored anywhere.

import { commit as ghCommit } from '@/lib/ghdata';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_PATH = 'crm-data.json';
const SNAPSHOT_DIR = 'snapshots';
const SNAPSHOT_RETENTION_DAYS = 30;

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Content-Type': 'application/json; charset=utf-8',
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...NO_STORE, ...extraHeaders },
  });
}

function cfg() {
  const token = process.env.CRM_GH_TOKEN;
  const repo = process.env.CRM_GH_REPO;
  const branch = process.env.CRM_GH_BRANCH || 'main';
  const authHash = process.env.CRM_AUTH_HASH;
  const missing = [];
  if (!token) missing.push('CRM_GH_TOKEN');
  if (!repo) missing.push('CRM_GH_REPO');
  if (!authHash) missing.push('CRM_AUTH_HASH');
  return { token, repo, branch, authHash, missing };
}

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time-ish comparison of two equal-length hex strings.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function authorize(req, conf) {
  const token = req.headers.get('x-crm-auth') || '';
  if (!token) return false;
  const hash = await sha256Hex(token);
  return safeEqual(hash, String(conf.authHash).trim().toLowerCase());
}

// ---------- GitHub Contents API helpers ----------

async function gh(conf, path, init = {}) {
  return ghAt(conf, `contents/${path}`, init);
}

// Any endpoint under the repo (contents/…, git/blobs/…), with a chosen Accept.
async function ghAt(conf, subpath, init = {}, accept = 'application/vnd.github+json') {
  const url = `https://api.github.com/repos/${conf.repo}/${subpath}`;
  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${conf.token}`,
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'advon-crm-sync',
      ...(init.headers || {}),
    },
  });
  // GitHub returns this on every fine-grained-PAT request. Remember it so the
  // CRM can warn before the token lapses instead of only after it breaks.
  const exp = res.headers.get('github-authentication-token-expiration');
  if (exp) conf.tokenExpiry = exp;
  return res;
}

// Turn a GitHub failure into something a human can act on.
// `code` is what the CRM keys off; `message` is what it shows if it does not
// recognise the code.
function ghFailure(status, text) {
  const body = String(text || '');
  if (status === 401) {
    return Object.assign(
      new Error(
        'The GitHub token for CRM sync has expired or been revoked. ' +
          'Create a new one and update CRM_GH_TOKEN in Netlify, then redeploy.'
      ),
      { code: 'token_expired' }
    );
  }
  if (status === 403) {
    return Object.assign(
      new Error(
        'GitHub refused the CRM sync token (no Contents write access on the ' +
          'data repo, or a rate limit). Check the token permissions.'
      ),
      { code: 'token_forbidden' }
    );
  }
  if (status === 404) {
    return Object.assign(
      new Error(
        'The data repo in CRM_GH_REPO was not found, or the token cannot see it.'
      ),
      { code: 'repo_not_found' }
    );
  }
  return Object.assign(new Error(`GitHub error ${status}: ${body.slice(0, 200)}`), {
    code: 'github_error',
  });
}

// Days left on the token, or null if GitHub did not say (e.g. classic PAT).
function tokenDaysLeft(conf) {
  if (!conf.tokenExpiry) return null;
  const t = Date.parse(conf.tokenExpiry);
  if (!Number.isFinite(t)) return null;
  return Math.floor((t - Date.now()) / 86400000);
}

function b64encode(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}
function b64decode(str) {
  return Buffer.from(str, 'base64').toString('utf8');
}

async function readData(conf) {
  const res = await gh(conf, `${DATA_PATH}?ref=${encodeURIComponent(conf.branch)}&t=${Date.now()}`);
  if (res.status === 404) return { exists: false, sha: null, payload: null };
  if (!res.ok) {
    throw ghFailure(res.status, await res.text());
  }
  const meta = await res.json();
  const text = await readContent(conf, meta);
  let payload = null;
  try {
    payload = JSON.parse(text);
  } catch {
    throw Object.assign(
      new Error(
        `Stored data is not valid JSON (${meta.size || 0} bytes on the server, ` +
          `${text.length} bytes read). The last good copy is in snapshots/ in the data repo.`
      ),
      { code: 'bad_json' }
    );
  }
  return { exists: true, sha: meta.sha, payload };
}

// The text of a file the Contents API just described.
// Files up to 1 MB arrive inline as base64. Anything larger comes back with
// encoding "none" and no content at all, so it is read through the Git blob
// API instead (that one goes up to 100 MB).
async function readContent(conf, meta) {
  if (meta && meta.encoding === 'base64' && meta.content) {
    return b64decode(String(meta.content).replace(/\n/g, ''));
  }
  if (!meta || !meta.sha) return '';
  const res = await ghAt(
    conf,
    `git/blobs/${meta.sha}`,
    { cache: 'no-store' },
    'application/vnd.github.raw'
  );
  if (!res.ok) throw ghFailure(res.status, await res.text());
  const ctype = res.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    // Older hosts ignore the raw media type and answer with the JSON envelope.
    const b = await res.json();
    if (b && b.content && b.encoding === 'base64') {
      return b64decode(String(b.content).replace(/\n/g, ''));
    }
    return '';
  }
  return res.text();
}

// ---------- Writing: one commit per save, retried on branch races (14 Sept 2026) ----------
// See lib/ghdata.js. The old Contents-API path made three kinds of commit per save
// (data, snapshot, background prunes) that raced each other and every other route for
// the branch head — GitHub answered «409 … is at X but expected Y» and the CRM showed it.
const SNAPSHOT_MAX_PRUNE = 120;      // deletions folded into one save commit, at most
let lastPruneAt = 0;                 // per function instance — pruning is best effort
class Conflict extends Error { constructor(remote) { super('conflict'); this.remote = remote; } }

// ---------- Handlers ----------

// GET /api/crm  → latest encrypted blob. Always fresh, never cached.
export async function GET(req) {
  const conf = cfg();
  if (conf.missing.length) {
    return json(
      { error: 'not_configured', missing: conf.missing, message: 'Sync is not configured yet.' },
      503
    );
  }
  if (!(await authorize(req, conf))) return json({ error: 'unauthorized' }, 401);

  try {
    const { exists, sha, payload } = await readData(conf);
    const tokenDays = tokenDaysLeft(conf);
    if (!exists) {
      return json({ empty: true, sha: null, updatedAt: null, data: null, tokenDays });
    }
    return json({
      empty: false,
      sha,
      updatedAt: payload.updatedAt || null,
      deviceId: payload.deviceId || null,
      data: payload.data || null,
      tokenDays,
    });
  } catch (e) {
    return json(
      {
        error: 'backend_error',
        code: e.code || 'github_error',
        message: String(e.message || e),
      },
      502
    );
  }
}

// PUT /api/crm  → store encrypted blob.
// Body: { data: {iv, ct}, updatedAt: ISO string, deviceId, baseSha }
// If baseSha does not match what is stored, responds 409 with the remote copy
// instead of overwriting it.
export async function PUT(req) {
  const conf = cfg();
  if (conf.missing.length) {
    return json(
      { error: 'not_configured', missing: conf.missing, message: 'Sync is not configured yet.' },
      503
    );
  }
  if (!(await authorize(req, conf))) return json({ error: 'unauthorized' }, 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request', message: 'Body must be JSON' }, 400);
  }

  const { data, updatedAt, deviceId, baseSha, baseUpdatedAt, force } = body || {};
  if (!data || typeof data.iv !== 'string' || typeof data.ct !== 'string') {
    return json({ error: 'bad_request', message: 'data must be {iv, ct}' }, 400);
  }

  const stamp = updatedAt || new Date().toISOString();
  const payload = { version: 4, updatedAt: stamp, deviceId: deviceId || 'unknown', data };
  const contentStr = JSON.stringify(payload, null, 2);
  const snapName = `${SNAPSHOT_DIR}/${stamp.slice(0, 13).replace(/[:.]/g, '-')}.json`;   // one snapshot per hour

  try {
    const out = await ghCommit(conf, `crm: save from ${deviceId || 'unknown device'} at ${stamp}`, async (ctx) => {
      const cur = await ctx.readJson(DATA_PATH, null);
      if (cur.badJson) {
        throw Object.assign(new Error('Stored data is not valid JSON. The last good copy is in snapshots/ in the data repo.'), { code: 'bad_json' });
      }
      // Optimistic concurrency, but only for a REAL conflict: another device wrote a
      // newer copy since this one last synced. A stale sha on its own (this device's
      // own earlier save, a lost response) is not a reason to block the save.
      if (cur.sha && !force && cur.sha !== baseSha) {
        const remote = cur.data || {};
        const otherDevice = remote.deviceId && remote.deviceId !== (deviceId || 'unknown');
        const newer = !baseUpdatedAt || !remote.updatedAt || remote.updatedAt > baseUpdatedAt;
        if (otherDevice && newer) throw new Conflict({ sha: cur.sha, updatedAt: remote.updatedAt || null, deviceId: remote.deviceId || null, data: remote.data || null });
      }
      const files = [
        { path: DATA_PATH, content: contentStr },
        { path: snapName, content: contentStr },
      ];
      // Prune snapshots older than 30 days inside the SAME commit, at most every 6 hours.
      if (Date.now() - lastPruneAt > 6 * 3600 * 1000) {
        try {
          const cutoff = Date.now() - SNAPSHOT_RETENTION_DAYS * 86400000;
          const list = await ctx.listDir(SNAPSHOT_DIR);
          let n = 0;
          for (const f of list) {
            const m = /^(\d{4}-\d{2}-\d{2})T/.exec(f.path || '');
            if (!m || f.type !== 'blob') continue;
            if (new Date(m[1] + 'T00:00:00Z').getTime() >= cutoff) continue;
            files.push({ path: `${SNAPSHOT_DIR}/${f.path}`, content: null });
            if (++n >= SNAPSHOT_MAX_PRUNE) break;
          }
          if (n < SNAPSHOT_MAX_PRUNE) lastPruneAt = Date.now();   // more left → prune again on the next save
        } catch { /* pruning is never allowed to fail a save */ }
      }
      return files;
    });
    return json({ ok: true, sha: out.blobs[DATA_PATH] || null, updatedAt: stamp, commit: out.commit });
  } catch (e) {
    if (e instanceof Conflict) {
      return json({ error: 'conflict', message: 'The stored copy changed since this device loaded it.', ...e.remote }, 409);
    }
    return json(
      { error: 'backend_error', code: e.code || 'github_error', message: String(e.message || e) },
      502
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...NO_STORE, Allow: 'GET,PUT,OPTIONS' },
  });
}
