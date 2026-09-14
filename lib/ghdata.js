// lib/ghdata.js — how every server route writes to the private data repo (14 Sept 2026).
//
// Before this file each route wrote through the GitHub *Contents* API: one commit per
// file, snapshot prunes fired in the background, and the CRM, the brief, the intake
// uploads and the lead endpoint all raced each other for the head of the branch.
// GitHub answers that race with «409 … is at <sha> but expected <sha>», which is the
// error Angelo kept seeing in the CRM banner.
//
// Now a write is ONE commit built with the Git Data API (blobs → tree → commit → ref):
//   • several files (and deletions) land in the same commit, so a CRM save with its
//     snapshot and its prunes is a single ref update instead of dozens;
//   • the ref update is the only step that can race, and when it does we simply rebuild
//     on the new head and try again (up to 8 times, with jittered back-off) — the caller's
//     `build(ctx)` runs again on every attempt, so it always sees the latest content.
//
// Usage:
//   const conf = ghConf();                                   // CRM_GH_TOKEN / CRM_GH_REPO / CRM_GH_BRANCH
//   const out = await commit(conf, 'message', async (ctx) => {
//     const cur = await ctx.readJson('leads/pool.json');     // {sha, data} of the file at this head
//     return [{ path: 'leads/pool.json', content: JSON.stringify(next) }];   // or content:null to delete
//   });                                                      // → { commit, blobs: {path: blobSha} }
//   Return null from build() to commit nothing.

const API = 'https://api.github.com';
const ATTEMPTS = 8;

export function ghConf() {
  return {
    token: process.env.CRM_GH_TOKEN,
    repo: process.env.CRM_GH_REPO,
    branch: process.env.CRM_GH_BRANCH || 'main',
    tokenExpiry: null,
  };
}
export const ghReady = (c) => !!(c && c.token && c.repo);

export function ghFailure(status, text) {
  const body = String(text || '');
  let e;
  if (status === 401) e = Object.assign(new Error('The GitHub token for CRM sync has expired or been revoked. Create a new one and update CRM_GH_TOKEN in Netlify, then redeploy.'), { code: 'token_expired' });
  else if (status === 403) e = Object.assign(new Error('GitHub refused the CRM sync token (no Contents write access on the data repo, or a rate limit). Check the token permissions.'), { code: 'token_forbidden' });
  else if (status === 404) e = Object.assign(new Error('The data repo in CRM_GH_REPO was not found, or the token cannot see it.'), { code: 'repo_not_found' });
  else e = Object.assign(new Error(`GitHub error ${status}: ${body.slice(0, 200)}`), { code: 'github_error' });
  e.status = status;
  return e;
}

export async function ghFetch(conf, subpath, init = {}, accept = 'application/vnd.github+json') {
  const url = subpath.startsWith('http') ? subpath : `${API}/repos/${conf.repo}/${subpath}`;
  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${conf.token}`,
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'advon-data',
      ...(init.body && typeof init.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  const exp = res.headers.get('github-authentication-token-expiration');
  if (exp) conf.tokenExpiry = exp;
  return res;
}

const b64e = (s) => Buffer.from(s, 'utf8').toString('base64');
const b64d = (s) => Buffer.from(String(s || '').replace(/\n/g, ''), 'base64').toString('utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isRace = (status, text) => status === 409 || status === 422 || (status === 404 && /No commit found/i.test(text));

// The head of the branch: commit sha + root tree sha.
export async function head(conf) {
  const r = await ghFetch(conf, `git/ref/heads/${encodeURIComponent(conf.branch)}`);
  if (r.status === 404) return null;                 // empty repo / unknown branch
  if (!r.ok) throw ghFailure(r.status, await r.text());
  const ref = await r.json();
  const c = await ghFetch(conf, `git/commits/${ref.object.sha}`);
  if (!c.ok) throw ghFailure(c.status, await c.text());
  const commit = await c.json();
  return { commit: ref.object.sha, tree: commit.tree.sha };
}

// Walk a tree by path segments → {sha, type} of the entry, or null.
export async function entryAt(conf, treeSha, path) {
  const parts = String(path).split('/').filter(Boolean);
  let sha = treeSha;
  for (let i = 0; i < parts.length; i++) {
    const r = await ghFetch(conf, `git/trees/${sha}`);
    if (!r.ok) throw ghFailure(r.status, await r.text());
    const t = await r.json();
    const hit = (t.tree || []).find((e) => e.path === parts[i]);
    if (!hit) return null;
    if (i === parts.length - 1) return { sha: hit.sha, type: hit.type, mode: hit.mode };
    if (hit.type !== 'tree') return null;
    sha = hit.sha;
  }
  return { sha, type: 'tree' };
}

// List the entries of a directory at this head (one level).
export async function listDir(conf, treeSha, path) {
  const e = path ? await entryAt(conf, treeSha, path) : { sha: treeSha, type: 'tree' };
  if (!e || e.type !== 'tree') return [];
  const r = await ghFetch(conf, `git/trees/${e.sha}`);
  if (!r.ok) throw ghFailure(r.status, await r.text());
  return ((await r.json()).tree || []).map((x) => ({ path: x.path, sha: x.sha, type: x.type, size: x.size }));
}

export async function blobText(conf, blobSha) {
  const r = await ghFetch(conf, `git/blobs/${blobSha}`, {}, 'application/vnd.github.raw');
  if (!r.ok) throw ghFailure(r.status, await r.text());
  const ctype = r.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    const b = await r.json();
    return b && b.encoding === 'base64' ? b64d(b.content) : '';
  }
  return r.text();
}
export async function blobBuffer(conf, blobSha) {
  const r = await ghFetch(conf, `git/blobs/${blobSha}`, {}, 'application/vnd.github.raw');
  if (!r.ok) throw ghFailure(r.status, await r.text());
  const ctype = r.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    const b = await r.json();
    return Buffer.from(String(b.content || '').replace(/\n/g, ''), 'base64');
  }
  return Buffer.from(await r.arrayBuffer());
}

// Read a text file at a given head → {sha, text} ({sha:null,text:null} when missing).
export async function readText(conf, treeSha, path) {
  const e = await entryAt(conf, treeSha, path);
  if (!e || e.type !== 'blob') return { sha: null, text: null };
  return { sha: e.sha, text: await blobText(conf, e.sha) };
}
export async function readJson(conf, treeSha, path, fallback = null) {
  const { sha, text } = await readText(conf, treeSha, path);
  if (text == null) return { sha: null, data: fallback };
  try { return { sha, data: JSON.parse(text) }; } catch { return { sha, data: fallback, badJson: true }; }
}

// Convenience: read one file at the current head (no commit).
export async function readAtHead(conf, path) {
  const h = await head(conf);
  if (!h) return { head: null, sha: null, text: null };
  const t = await readText(conf, h.tree, path);
  return { head: h, ...t };
}

// Upload bytes as a loose blob (no commit yet) → sha. Used for intake uploads so a
// 20-photo submission is ONE commit at the end instead of 40.
export async function createBlob(conf, buffer) {
  const r = await ghFetch(conf, 'git/blobs', { method: 'POST', body: JSON.stringify({ content: Buffer.from(buffer).toString('base64'), encoding: 'base64' }) });
  if (!r.ok) throw ghFailure(r.status, await r.text());
  return (await r.json()).sha;
}

// files: [{path, content:string|Buffer|null, blobSha?}] — content null = delete; blobSha = reuse an uploaded blob.
export async function commit(conf, message, build, opts = {}) {
  const attempts = opts.attempts || ATTEMPTS;
  let lastErr = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const h = await head(conf);
    const ctx = {
      head: h,
      readText: (p) => (h ? readText(conf, h.tree, p) : Promise.resolve({ sha: null, text: null })),
      readJson: (p, fb = null) => (h ? readJson(conf, h.tree, p, fb) : Promise.resolve({ sha: null, data: fb })),
      listDir: (p) => (h ? listDir(conf, h.tree, p) : Promise.resolve([])),
      attempt,
    };
    const files = await build(ctx);
    if (!files) return { commit: h ? h.commit : null, blobs: {}, skipped: true };
    const entries = [];
    const blobs = {};
    for (const f of files) {
      if (f.content === null || f.content === undefined) {
        if (!f.blobSha) { entries.push({ path: f.path, mode: '100644', type: 'blob', sha: null }); continue; }
        blobs[f.path] = f.blobSha;
        entries.push({ path: f.path, mode: '100644', type: 'blob', sha: f.blobSha });
        continue;
      }
      const sha = await createBlob(conf, typeof f.content === 'string' ? Buffer.from(f.content, 'utf8') : f.content);
      blobs[f.path] = sha;
      entries.push({ path: f.path, mode: '100644', type: 'blob', sha });
    }
    if (!entries.length) return { commit: h ? h.commit : null, blobs, skipped: true };
    const treeBody = { tree: entries };
    if (h) treeBody.base_tree = h.tree;
    const tr = await ghFetch(conf, 'git/trees', { method: 'POST', body: JSON.stringify(treeBody) });
    if (!tr.ok) {
      const txt = await tr.text();
      if (isRace(tr.status, txt) && attempt < attempts - 1) { lastErr = ghFailure(tr.status, txt); await sleep(200 * 2 ** attempt + Math.random() * 300); continue; }
      throw ghFailure(tr.status, txt);
    }
    const tree = (await tr.json()).sha;
    const cr = await ghFetch(conf, 'git/commits', { method: 'POST', body: JSON.stringify({ message, tree, parents: h ? [h.commit] : [] }) });
    if (!cr.ok) throw ghFailure(cr.status, await cr.text());
    const newCommit = (await cr.json()).sha;
    const rr = h
      ? await ghFetch(conf, `git/refs/heads/${encodeURIComponent(conf.branch)}`, { method: 'PATCH', body: JSON.stringify({ sha: newCommit, force: false }) })
      : await ghFetch(conf, 'git/refs', { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${conf.branch}`, sha: newCommit }) });
    if (rr.ok) return { commit: newCommit, blobs };
    const txt = await rr.text();
    lastErr = ghFailure(rr.status, txt);
    if (!isRace(rr.status, txt)) throw lastErr;
    await sleep(200 * 2 ** attempt + Math.random() * 300);     // someone else won the race — rebuild on their head
  }
  throw lastErr || new Error('GitHub write failed');
}

// read → change → write, retried on races. fn(data) returns the next value (or undefined to skip).
export async function mutateJson(conf, path, fn, message, fallback = null) {
  let out;
  await commit(conf, message, async (ctx) => {
    const { data } = await ctx.readJson(path, fallback);
    out = await fn(data === null || data === undefined ? fallback : data);
    if (out === undefined) return null;
    return [{ path, content: JSON.stringify(out, null, 1) }];
  });
  return out;
}

export function tokenDaysLeft(conf) {
  if (!conf.tokenExpiry) return null;
  const t = Date.parse(conf.tokenExpiry);
  if (!Number.isFinite(t)) return null;
  return Math.floor((t - Date.now()) / 86400000);
}
