// app/api/pool/route.js
//
// Lead pool for the CRM's Leads tab (13 Sept 2026).
//
//   GET /api/pool   (CRM, x-crm-auth) — returns leads/pool.json from the private data repo:
//                                       { updated, leads:[{key,name,spec,phone,city,addr,reviews,score,url,added,src}] }
//
// The pool is appended by the weekly doctoranytime harvest (it writes to GitHub directly);
// the CRM merges anything with a key it has not seen. Same env vars as /api/crm.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const POOL_PATH = 'leads/pool.json';
const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });

function cfg() {
  return {
    token: process.env.CRM_GH_TOKEN,
    repo: process.env.CRM_GH_REPO,
    branch: process.env.CRM_GH_BRANCH || 'main',
    authHash: process.env.CRM_AUTH_HASH,
  };
}
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function authorized(req, c) {
  if (!c.authHash) return false;
  const token = req.headers.get('x-crm-auth') || '';
  if (!token) return false;
  return safeEqual(await sha256Hex(token), String(c.authHash).trim().toLowerCase());
}

export async function GET(req) {
  const c = cfg();
  if (!c.token || !c.repo) return json({ error: 'storage not configured' }, 503);
  if (!(await authorized(req, c))) return json({ error: 'unauthorized' }, 401);
  try {
    // raw download URL keeps files > 1MB working (the contents API caps base64 at 1MB)
    const res = await fetch(`https://api.github.com/repos/${c.repo}/contents/${POOL_PATH}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${c.token}`,
        Accept: 'application/vnd.github.raw+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'advon-pool',
      },
    });
    if (res.status === 404) return json({ updated: null, leads: [] });
    if (!res.ok) return json({ error: `GitHub read failed (${res.status})` }, 502);
    const data = await res.json();
    const leads = Array.isArray(data.leads) ? data.leads : [];
    return json({ updated: data.updated || null, leads });
  } catch (e) {
    return json({ error: e.message || 'read failed' }, 502);
  }
}
