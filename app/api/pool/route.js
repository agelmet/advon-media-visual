// app/api/pool/route.js
//
// Lead pool for the CRM's Leads tab (13 Sept 2026).
//
//   GET  /api/pool  (CRM, x-crm-auth) — returns leads/pool.json from the private data repo plus leads/lists.json
//                                       (Angelo's own lists with a category each): { updated, lists:{key:{t,sub,check}},
//                                       leads:[{key,name,spec,phone,city,addr,reviews,score,url,added,src,list?,ord?,note?}] }
//   POST /api/pool?k=<read key>        — APPEND-ONLY: body {leads:[...]} from the harvest script running inside
//                                       a doctoranytime tab (CORS-allowed for that origin). Unknown keys are added,
//                                       nothing is ever removed or changed. Answers {added, total}.
//
// The pool is appended by the weekly doctoranytime harvest (it writes to GitHub directly);
// the CRM merges anything with a key it has not seen. Same env vars as /api/crm.

import { mutateJson } from '@/lib/ghdata';

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

const LISTS_PATH = 'leads/lists.json';
async function readLists(c) {
  try {
    const r = await fetch(`https://api.github.com/repos/${c.repo}/contents/${LISTS_PATH}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${c.token}`, Accept: 'application/vnd.github.raw+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'advon-pool' },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
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
    if (res.status === 404 && !(await readLists(c))) return json({ updated: null, leads: [], lists: {} });
    if (!res.ok && res.status !== 404) return json({ error: `GitHub read failed (${res.status})` }, 502);
    const data = res.ok ? await res.json() : { updated: null, leads: [] };
    const leads = Array.isArray(data.leads) ? data.leads : [];
    // Angelo's own lists (leads/lists.json — e.g. the dentists from his Excel) ride along with their category names
    const own = await readLists(c);
    const lists = own && own.lists && typeof own.lists === 'object' ? own.lists : {};
    const extra = own && Array.isArray(own.leads) ? own.leads : [];
    return json({ updated: data.updated || null, leads: leads.concat(extra), lists });
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
  let added = 0, total = 0;
  try {
    await mutateJson(c, POOL_PATH, (pool) => {
      if (!pool || typeof pool !== 'object') pool = { updated: null, leads: [] };
      if (!Array.isArray(pool.leads)) pool.leads = [];
      const have = new Set(pool.leads.map((l) => l.key));
      const add = incoming.filter((l) => !have.has(l.key));
      total = pool.leads.length + add.length; added = add.length;
      if (!add.length) return undefined;                       // nothing new → no commit
      pool.leads.push(...add); pool.updated = new Date().toISOString();
      return pool;
    }, `leads: +${incoming.length} from harvest`, { updated: null, leads: [] });
  } catch (e) {
    return new Response(JSON.stringify({ error: `GitHub write failed (${e.status || ''})`.trim() }), { status: 502, headers: { ...NO_STORE, ...h } });
  }
  return new Response(JSON.stringify({ added, total }), { status: 200, headers: { ...NO_STORE, ...h } });
}
