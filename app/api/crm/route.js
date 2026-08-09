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
// Every write is a git commit, so history is durable and recoverable, and a
// dated snapshot file is kept for at least 30 days.
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
  const url = `https://api.github.com/repos/${conf.repo}/contents/${path}`;
  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${conf.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'advon-crm-sync',
      ...(init.headers || {}),
    },
  });
  return res;
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
    const text = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const meta = await res.json();
  let payload = null;
  try {
    payload = JSON.parse(b64decode(meta.content.replace(/\n/g, '')));
  } catch {
    throw new Error('Stored data is not valid JSON');
  }
  return { exists: true, sha: meta.sha, payload };
}

async function writeFile(conf, path, contentStr, sha, message) {
  const body = {
    message,
    content: b64encode(contentStr),
    branch: conf.branch,
  };
  if (sha) body.sha = sha;
  const res = await gh(conf, path, { method: 'PUT', body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}

// Keep dated snapshots for at least SNAPSHOT_RETENTION_DAYS; delete older ones.
// Failures here are non-fatal — never block a save because pruning failed.
async function pruneSnapshots(conf) {
  try {
    const res = await gh(
      conf,
      `${SNAPSHOT_DIR}?ref=${encodeURIComponent(conf.branch)}&t=${Date.now()}`
    );
    if (!res.ok) return;
    const list = await res.json();
    if (!Array.isArray(list)) return;
    const cutoff = Date.now() - SNAPSHOT_RETENTION_DAYS * 86400000;
    for (const f of list) {
      const m = /^(\d{4}-\d{2}-\d{2})T/.exec(f.name || '');
      if (!m) continue;
      if (new Date(m[1] + 'T00:00:00Z').getTime() >= cutoff) continue;
      await gh(conf, `${SNAPSHOT_DIR}/${f.name}`, {
        method: 'DELETE',
        body: JSON.stringify({
          message: `chore(crm): prune snapshot ${f.name}`,
          sha: f.sha,
          branch: conf.branch,
        }),
      });
    }
  } catch {
    /* non-fatal */
  }
}

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
    if (!exists) {
      return json({ empty: true, sha: null, updatedAt: null, data: null });
    }
    return json({
      empty: false,
      sha,
      updatedAt: payload.updatedAt || null,
      deviceId: payload.deviceId || null,
      data: payload.data || null,
    });
  } catch (e) {
    return json({ error: 'backend_error', message: String(e.message || e) }, 502);
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

  const { data, updatedAt, deviceId, baseSha, force } = body || {};
  if (!data || typeof data.iv !== 'string' || typeof data.ct !== 'string') {
    return json({ error: 'bad_request', message: 'data must be {iv, ct}' }, 400);
  }

  try {
    const current = await readData(conf);

    // Optimistic concurrency: refuse to clobber a newer remote copy.
    if (current.exists && !force && current.sha !== baseSha) {
      return json(
        {
          error: 'conflict',
          message: 'The stored copy changed since this device loaded it.',
          sha: current.sha,
          updatedAt: current.payload?.updatedAt || null,
          deviceId: current.payload?.deviceId || null,
          data: current.payload?.data || null,
        },
        409
      );
    }

    const stamp = updatedAt || new Date().toISOString();
    const payload = {
      version: 4,
      updatedAt: stamp,
      deviceId: deviceId || 'unknown',
      data,
    };
    const contentStr = JSON.stringify(payload, null, 2);

    const written = await writeFile(
      conf,
      DATA_PATH,
      contentStr,
      current.exists ? current.sha : null,
      `crm: save from ${deviceId || 'unknown device'} at ${stamp}`
    );

    // Dated snapshot — one file per save, pruned after 30 days.
    const snapName = `${stamp.replace(/[:.]/g, '-')}.json`;
    try {
      await writeFile(
        conf,
        `${SNAPSHOT_DIR}/${snapName}`,
        contentStr,
        null,
        `crm: snapshot ${stamp}`
      );
    } catch {
      /* snapshot failure must not fail the save */
    }
    pruneSnapshots(conf).catch(() => {});

    return json({ ok: true, sha: written.content?.sha || null, updatedAt: stamp });
  } catch (e) {
    return json({ error: 'backend_error', message: String(e.message || e) }, 502);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...NO_STORE, Allow: 'GET,PUT,OPTIONS' },
  });
}
