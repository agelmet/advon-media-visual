// app/api/lead/route.js
//
// Lead inbox for the Advon CRM.
//
//   POST   /api/lead   (public)  — the landing-page / contact forms post here.
//                                  Stores the lead in the private data repo
//                                  (leads/inbox.json) and notifies Angelo.
//   GET    /api/lead   (CRM)     — returns pending leads   { leads: [...] }
//   DELETE /api/lead   (CRM)     — acknowledges leads      { ids: [...] }
//
// GET/DELETE use the same `x-crm-auth` header + CRM_AUTH_HASH as /api/crm.
// Storage reuses the CRM sync variables (CRM_GH_TOKEN, CRM_GH_REPO, CRM_GH_BRANCH).
// Notifications are optional and independent of storage:
//   RESEND_API_KEY + LEAD_NOTIFY_TO (+ LEAD_FROM, default "Advon Leads <forms@advonmedia.com>")
//   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
// A lead is only reported as failed if BOTH storage and every notification fail.

import { commit as ghCommit, mutateJson } from '@/lib/ghdata';
import { crmCors, crmPreflight } from '@/lib/crmcors';
import { makeStamp, checkStamp, contentVerdict, phoneVerdict, tooMany, clientIp } from '@/lib/antispam';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INBOX_PATH = 'leads/inbox.json';
const SPAM_PATH = 'leads/spam.json';          // what the robot checks caught (20 Oct 2026) — the CRM shows it
const MAX_LEADS = 500;
const MAX_SPAM = 400;

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Content-Type': 'application/json; charset=utf-8',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: NO_STORE });
}

function cfg() {
  return {
    token: process.env.CRM_GH_TOKEN,
    repo: process.env.CRM_GH_REPO,
    branch: process.env.CRM_GH_BRANCH || 'main',
    authHash: process.env.CRM_AUTH_HASH,
    resendKey: process.env.RESEND_API_KEY,
    notifyTo: process.env.LEAD_NOTIFY_TO || 'angelos@advonmedia.com',
    from: process.env.LEAD_FROM || 'Advon Leads <forms@advonmedia.com>',
    tgToken: process.env.TELEGRAM_BOT_TOKEN,
    tgChat: process.env.TELEGRAM_CHAT_ID,
  };
}
const storageReady = (c) => !!(c.token && c.repo);

// ---------- auth (same scheme as /api/crm) ----------
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

// ---------- GitHub Contents API ----------
const POOL_PATH = 'leads/pool.json';

// Read the inbox at the current head (GET/DELETE) — through the same helper as every write.
async function readInbox(c) {
  let leads = [];
  await ghCommit(c, 'noop', async (ctx) => { const { data } = await ctx.readJson(INBOX_PATH, []); leads = Array.isArray(data) ? data : []; return null; });
  return { leads };
}
const mutateInbox = (c, fn, message) => mutateJson(c, INBOX_PATH, (leads) => fn(Array.isArray(leads) ? leads : []), message, []);

// A lead from the ads page goes to TWO places in the same commit: leads/inbox.json
// (the raw record) and leads/pool.json as list «ads», so it shows up in the CRM's
// Leads tab under «From the ads» with the 5-minute call timer.
async function storeLead(c, lead) {
  const digits = lead.phone.replace(/\D/g, '');
  const poolLead = {
    key: `ad:${digits}`, name: lead.name, spec: lead.profession || '', phone: digits, city: '', addr: '',
    reviews: 0, score: null, url: '', added: lead.createdAt.slice(0, 10), src: 'ads', list: 'ads',
    note: [lead.source === 'site' ? 'Φόρμα advonmedia.com' : '', lead.message, lead.email, [lead.utm_source, lead.utm_campaign, lead.utm_content].filter(Boolean).join(' / ')].filter(Boolean).join(' · '),
    at: lead.createdAt,
  };
  await ghCommit(c, `lead: ${lead.name} (${lead.source})`, async (ctx) => {
    const inbox = await ctx.readJson(INBOX_PATH, []);
    const pool = await ctx.readJson(POOL_PATH, { updated: null, leads: [] });
    const leads = Array.isArray(inbox.data) ? inbox.data : [];
    const p = pool.data && typeof pool.data === 'object' ? pool.data : { updated: null, leads: [] };
    if (!Array.isArray(p.leads)) p.leads = [];
    if (!p.leads.some((l) => l.key === poolLead.key)) { p.leads.push(poolLead); p.updated = new Date().toISOString(); }
    return [
      { path: INBOX_PATH, content: JSON.stringify([...leads, lead].slice(-MAX_LEADS), null, 1) },
      { path: POOL_PATH, content: JSON.stringify(p) },
    ];
  });
}

// ---------- validation ----------
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
function normalisePhone(raw) {
  const digits = String(raw || '').replace(/[^\d+]/g, '');
  if (!digits) return '';
  let d = digits.replace(/^\+/, '');
  if (d.startsWith('0030')) d = d.slice(4);
  if (d.startsWith('30') && d.length === 12) d = d.slice(2);
  if (d.length === 10 && /^(69|2)/.test(d)) return `+30${d}`;
  return `+${d}`;
}
function validLead(l) {
  if (l.name.length < 2) return 'name';
  const digits = l.phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return 'phone';
  if (l.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(l.email)) return 'email';
  return null;
}

// ---------- rate limit (best effort, per function instance) ----------
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 8;
}

// ---------- notifications ----------
function leadText(l) {
  const lines = [
    `Νέο lead — ${l.source}`,
    `Όνομα: ${l.name}`,
    l.profession ? `Επάγγελμα: ${l.profession}` : '',
    `Τηλέφωνο: ${l.phone}`,
    l.email ? `Email: ${l.email}` : '',
    l.message ? `Μήνυμα: ${l.message}` : '',
    [l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content].filter(Boolean).length ? `UTM: ${[l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content].filter(Boolean).join(' / ')}` : '',
    l.page ? `Σελίδα: ${l.page}` : '',
    `Ώρα: ${new Date(l.createdAt).toLocaleString('el-GR', { timeZone: 'Europe/Athens' })}`,
    '',
    'Κάλεσε μέσα σε 5 λεπτά.',
  ];
  return lines.filter((x) => x !== '').join('\n');
}

async function notifyEmail(c, l) {
  if (!c.resendKey || !c.notifyTo) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${c.resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: c.from,
      to: [c.notifyTo],
      subject: `Νέο lead: ${l.name}${l.profession ? ' — ' + l.profession : ''} (${l.phone})`,
      text: leadText(l),
    }),
  });
  return res.ok;
}

async function notifyTelegram(c, l) {
  if (!c.tgToken || !c.tgChat) return false;
  const res = await fetch(`https://api.telegram.org/bot${c.tgToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: c.tgChat, text: leadText(l) }),
  });
  return res.ok;
}

// ---------- robots (20 Oct 2026) ----------
// Everything a robot sends is answered exactly like a real lead («sent ✓») so it has no reason to try another
// way, and is filed in leads/spam.json instead of the inbox — nothing is e-mailed, nothing reaches the CRM
// Leads tab. The CRM shows the list («Caught as spam») with a «Not spam» button that sends it on as a lead.
const fakeOk = () => json({ ok: true, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` });
async function fileSpam(c, req, body, reason) {
  const ip = clientIp(req);
  // A flood must never turn into a flood of commits: at most 3 per address an hour, 40 an hour in all.
  if (tooMany(`spam:${ip}`, 3, 3600e3) || tooMany('spam:all', 40, 3600e3) || !storageReady(c)) return;
  const rec = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    reason,
    source: clean(body.source, 40) || 'website',
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    profession: clean(body.profession, 120),
    message: clean(body.message, 600),
    page: clean(body.page, 200),
    ip,
    ua: clean(req.headers.get('user-agent'), 160),
  };
  try {
    await mutateJson(c, SPAM_PATH, (list) => [...(Array.isArray(list) ? list : []), rec].slice(-MAX_SPAM), `spam caught: ${reason}`, []);
  } catch (e) { console.error('[lead] spam file failed', e?.message); }
}

function buildLead(body) {
  const pv = phoneVerdict(clean(body.phone, 40));
  return {
    lead: {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      name: clean(body.name, 120),
      profession: clean(body.profession, 120),
      phone: pv.e164 || normalisePhone(clean(body.phone, 40)),
      email: clean(body.email, 160).toLowerCase(),
      message: clean(body.message, 2000),
      source: clean(body.source, 40) || 'website',
      utm_source: clean(body.utm_source, 80),
      utm_medium: clean(body.utm_medium, 80),
      utm_campaign: clean(body.utm_campaign, 120),
      utm_content: clean(body.utm_content, 120),
      page: clean(body.page, 200),
      createdAt: new Date().toISOString(),
    },
    phoneOk: pv.ok,
  };
}

// ---------- handlers ----------
async function __POST(req) {
  const c = cfg();
  const url = new URL(req.url);
  if (url.searchParams.get('unspam') === '1') return unspam(req, c);
  const ip = clientIp(req);
  if (limited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  let body;
  try {
    const ct = req.headers.get('content-type') || '';
    body = ct.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  body = body && typeof body === 'object' ? body : {};

  // 1. the hidden field only robots fill in (named differently on the two forms)
  if (clean(body.website, 50) || clean(body._gotcha, 50) || clean(body.company_url, 50)) { await fileSpam(c, req, body, 'hidden-field'); return fakeOk(); }
  // 2 + 3. the page's stamp: missing/forged = never opened the page, under 3 s = a robot
  const st = checkStamp(body.stamp);
  if (!st.ok) { await fileSpam(c, req, body, st.why); return fakeOk(); }
  // 5. links, foreign script, spam phrases, made-up names, throwaway e-mails
  const why = contentVerdict(body);
  if (why) { await fileSpam(c, req, body, why); return fakeOk(); }

  const { lead, phoneOk } = buildLead(body);
  // 4. the phone — a person who came through the page is told to fix it (robots never get this far)
  if (!phoneOk) return json({ ok: false, error: 'invalid_phone' }, 400);
  const invalid = validLead(lead);
  if (invalid) return json({ ok: false, error: `invalid_${invalid}` }, 400);

  return deliver(c, lead);
}

async function deliver(c, lead) {
  const results = { stored: false, email: false, telegram: false };
  if (storageReady(c)) {
    try {
      await storeLead(c, lead);
      results.stored = true;
    } catch (e) {
      console.error('[lead] store failed', e?.message);
    }
  }
  const [email, telegram] = await Promise.all([
    notifyEmail(c, lead).catch((e) => { console.error('[lead] email failed', e?.message); return false; }),
    notifyTelegram(c, lead).catch((e) => { console.error('[lead] telegram failed', e?.message); return false; }),
  ]);
  results.email = email;
  results.telegram = telegram;

  if (!results.stored && !results.email && !results.telegram) {
    console.error('[lead] no delivery channel configured or all failed', lead.id);
    return json({ ok: false, error: 'not_configured' }, 503);
  }
  return json({ ok: true, id: lead.id, delivered: results });
}

async function __GET(req) {
  const c = cfg();
  const url = new URL(req.url);
  // Public: the stamp every form fetches when the page opens.
  if (url.searchParams.get('stamp') === '1') return json({ ok: true, stamp: makeStamp() });
  if (!(await authorized(req, c))) return json({ ok: false, error: 'unauthorized' }, 401);
  if (url.searchParams.get('spam') === '1') {
    if (!storageReady(c)) return json({ ok: false, error: 'not_configured', spam: [] }, 503);
    try {
      let spam = [];
      await ghCommit(c, 'noop', async (ctx) => { const { data } = await ctx.readJson(SPAM_PATH, []); spam = Array.isArray(data) ? data : []; return null; });
      return json({ ok: true, spam: spam.slice().reverse() });
    } catch (e) { return json({ ok: false, error: e.message }, 502); }
  }
  if (!storageReady(c)) return json({ ok: false, error: 'not_configured', leads: [] }, 503);
  try {
    const { leads } = await readInbox(c);
    return json({ ok: true, leads });
  } catch (e) {
    return json({ ok: false, error: e.message }, 502);
  }
}

async function __DELETE(req) {
  const c = cfg();
  if (!(await authorized(req, c))) return json({ ok: false, error: 'unauthorized' }, 401);
  if (new URL(req.url).searchParams.get('spam') === '1') return dropSpam(req, c);
  if (!storageReady(c)) return json({ ok: false, error: 'not_configured' }, 503);
  let ids = [];
  try {
    const body = await req.json();
    ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
  } catch {}
  if (!ids.length) return json({ ok: true, removed: 0 });
  try {
    const set = new Set(ids);
    let removed = 0;
    await mutateInbox(c, (leads) => {
      const next = leads.filter((l) => !set.has(String(l.id)));
      removed = leads.length - next.length;
      return next;
    }, `leads acknowledged (${ids.length})`);
    return json({ ok: true, removed });
  } catch (e) {
    return json({ ok: false, error: e.message }, 502);
  }
}

// CRM: «Not spam» — take one record out of the spam list and deliver it as a normal lead.
async function unspam(req, c) {
  if (!(await authorized(req, c))) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!storageReady(c)) return json({ ok: false, error: 'not_configured' }, 503);
  let id = '';
  try { id = String((await req.json())?.id || ''); } catch {}
  if (!id) return json({ ok: false, error: 'no_id' }, 400);
  let rec = null;
  try {
    await mutateJson(c, SPAM_PATH, (list) => {
      const arr = Array.isArray(list) ? list : [];
      rec = arr.find((r) => String(r.id) === id) || null;
      return rec ? arr.filter((r) => String(r.id) !== id) : undefined;
    }, 'spam released by Angelo', []);
  } catch (e) { return json({ ok: false, error: e.message }, 502); }
  if (!rec) return json({ ok: false, error: 'not_found' }, 404);
  const { lead } = buildLead({ ...rec, source: rec.source || 'website' });
  return deliver(c, lead);
}
async function dropSpam(req, c) {
  if (!storageReady(c)) return json({ ok: false, error: 'not_configured' }, 503);
  let ids = [], all = false;
  try { const b = await req.json(); ids = Array.isArray(b?.ids) ? b.ids.map(String) : []; all = b?.all === true; } catch {}
  try {
    const set = new Set(ids);
    let removed = 0;
    await mutateJson(c, SPAM_PATH, (list) => {
      const arr = Array.isArray(list) ? list : [];
      const next = all ? [] : arr.filter((r) => !set.has(String(r.id)));
      removed = arr.length - next.length;
      return removed ? next : undefined;
    }, `spam cleared (${all ? 'all' : ids.length})`, []);
    return json({ ok: true, removed });
  } catch (e) { return json({ ok: false, error: e.message }, 502); }
}

export const POST = crmCors(__POST);
export const GET = crmCors(__GET);
export const DELETE = crmCors(__DELETE);
export const OPTIONS = crmPreflight();
