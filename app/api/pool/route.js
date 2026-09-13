// app/api/pool/route.js
//
// Lead pool for the CRM's Leads tab (13 Sept 2026).
//
//   GET  /api/pool  (CRM, x-crm-auth) — returns leads/pool.json from the private data repo:
//                                       { updated, leads:[{key,name,spec,phone,city,addr,reviews,score,url,added,src}] }
//   POST /api/pool?k=<read key>        — APPEND-ONLY: body {leads:[...]} from the harvest script running inside
//                                       a doctoranytime tab (CORS-allowed for that origin). Unknown keys are added,
//                                       nothing is ever removed or changed. Answers {added, total}.
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

// ---------- append from the harvester (runs in a doctoranytime.gr tab) ----------
const READ_KEY_SHA256 = '78085eb3d9b816c080a3cbeee27e1b67cd5775b568083951a66ef6f5c1aa65d6';
const ALLOWED_ORIGINS = ['https://www.doctoranytime.gr', 'https://doctoranytime.gr', 'https://advonmedia.com'];
function cors(req) {
  const o = req.headers.get('origin') || '';
  const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' };
  if (ALLOWED_ORIGINS.includes(o)) { h['Access-Control-Allow-Origin'] = o; h.Vary = 'Origin'; }
  return h;
}
export async function OPTIONS(req) { return new Response(null, { status: 204, headers: cors(req) }); }
async function ghRaw(c, path, init = {}) {
  return fetch(`https://api.github.com/repos/${c.repo}/contents/${path}`, {
    ...init, cache: 'no-store',
    headers: { Authorization: `Bearer ${c.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'advon-pool', ...(init.headers || {}) },
  });
}
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
export async function POST(req) {
  const c = cfg();
  const h = cors(req);
  if (!c.token || !c.repo) return new Response(JSON.stringify({ error: 'storage not configured' }), { status: 503, headers: { ...NO_STORE, ...h } });
  const k = new URL(req.url).searchParams.get('k') || '';
  if (!k || (await sha256Hex(k)) !== READ_KEY_SHA256) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...NO_STORE, ...h } });
  let body; try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers: { ...NO_STORE, ...h } }); }
  const incoming = (Array.isArray(body && body.leads) ? body.leads : []).slice(0, 2000).map((l) => ({
    key: clean(l.key, 120), name: clean(l.name, 120), spec: clean(l.spec, 80), phone: clean(l.phone, 20).replace(/\D/g, ''), city: clean(l.city, 80), addr: clean(l.addr, 160),
    reviews: Math.max(0, parseInt(l.reviews, 10) || 0), score: l.score == null ? null : (parseFloat(l.score) || null), url: clean(l.url, 300), added: clean(l.added, 10) || new Date().toISOString().slice(0, 10), src: clean(l.src, 40) || 'harvest',
  })).filter((l) => l.key && l.name && l.phone.length >= 8);
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await ghRaw(c, `${POOL_PATH}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`);
    let sha = null, pool = { updated: null, leads: [] };
    if (res.ok) {
      const meta = await res.json(); sha = meta.sha;
      let text = '';
      if (meta.content) text = Buffer.from(String(meta.content).replace(/\n/g, ''), 'base64').toString('utf8');
      else { const raw = await ghRaw(c, `${POOL_PATH}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`, { headers: { Accept: 'application/vnd.github.raw+json' } }); if (raw.ok) text = await raw.text(); }   // files over 1MB come back without content
      try { pool = JSON.parse(text); } catch {}
    }
    else if (res.status !== 404) return new Response(JSON.stringify({ error: `GitHub read failed (${res.status})` }), { status: 502, headers: { ...NO_STORE, ...h } });
    if (!Array.isArray(pool.leads)) pool.leads = [];
    const have = new Set(pool.leads.map((l) => l.key));
    const add = incoming.filter((l) => !have.has(l.key));
    if (!add.length) return new Response(JSON.stringify({ added: 0, total: pool.leads.length }), { status: 200, headers: { ...NO_STORE, ...h } });
    pool.leads.push(...add); pool.updated = new Date().toISOString();
    const put = await ghRaw(c, POOL_PATH, { method: 'PUT', body: JSON.stringify({ message: `leads: +${add.length} from harvest`, content: Buffer.from(JSON.stringify(pool)).toString('base64'), branch: c.branch, ...(sha ? { sha } : {}) }) });
    if (put.ok) return new Response(JSON.stringify({ added: add.length, total: pool.leads.length }), { status: 200, headers: { ...NO_STORE, ...h } });
    if (!(put.status === 409 || put.status === 422) || attempt === 2) return new Response(JSON.stringify({ error: `GitHub write failed (${put.status})` }), { status: 502, headers: { ...NO_STORE, ...h } });
  }
}
