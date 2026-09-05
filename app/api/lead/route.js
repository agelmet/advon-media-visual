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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INBOX_PATH = 'leads/inbox.json';
const MAX_LEADS = 500;

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
async function gh(c, path, init = {}) {
  return fetch(`https://api.github.com/repos/${c.repo}/contents/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'advon-lead-inbox',
      ...(init.headers || {}),
    },
  });
}
const b64e = (s) => Buffer.from(s, 'utf8').toString('base64');
const b64d = (s) => Buffer.from(s, 'base64').toString('utf8');

async function readInbox(c) {
  const res = await gh(c, `${INBOX_PATH}?ref=${encodeURIComponent(c.branch)}&t=${Date.now()}`);
  if (res.status === 404) return { sha: null, leads: [] };
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const meta = await res.json();
  let leads = [];
  try { leads = JSON.parse(b64d(String(meta.content || '').replace(/\n/g, ''))); } catch { leads = []; }
  if (!Array.isArray(leads)) leads = [];
  return { sha: meta.sha, leads };
}

async function writeInbox(c, leads, sha, message) {
  const body = { message, content: b64e(JSON.stringify(leads, null, 2)), branch: c.branch };
  if (sha) body.sha = sha;
  const res = await gh(c, INBOX_PATH, { method: 'PUT', body: JSON.stringify(body) });
  if (!res.ok) {
    const err = new Error(`GitHub write failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
}

async function mutateInbox(c, fn, message) {
  // read → mutate → write, retried once on a concurrent-write conflict
  for (let attempt = 0; attempt < 3; attempt++) {
    const { sha, leads } = await readInbox(c);
    const next = fn(leads);
    try {
      await writeInbox(c, next, sha, message);
      return next;
    } catch (e) {
      if (attempt === 2 || !(e.status === 409 || e.status === 422)) throw e;
    }
  }
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

// ---------- handlers ----------
export async function POST(req) {
  const c = cfg();
  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  let body;
  try {
    const ct = req.headers.get('content-type') || '';
    body = ct.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries());
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  if (clean(body.website, 50)) return json({ ok: true, id: 'ignored' }); // honeypot filled → pretend success

  const lead = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: clean(body.name, 120),
    profession: clean(body.profession, 120),
    phone: normalisePhone(clean(body.phone, 40)),
    email: clean(body.email, 160).toLowerCase(),
    message: clean(body.message, 2000),
    source: clean(body.source, 40) || 'website',
    utm_source: clean(body.utm_source, 80),
    utm_medium: clean(body.utm_medium, 80),
    utm_campaign: clean(body.utm_campaign, 120),
    utm_content: clean(body.utm_content, 120),
    page: clean(body.page, 200),
    createdAt: new Date().toISOString(),
  };
  const invalid = validLead(lead);
  if (invalid) return json({ ok: false, error: `invalid_${invalid}` }, 400);

  const results = { stored: false, email: false, telegram: false };
  if (storageReady(c)) {
    try {
      await mutateInbox(c, (leads) => [...leads, lead].slice(-MAX_LEADS), `lead: ${lead.name} (${lead.source})`);
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

export async function GET(req) {
  const c = cfg();
  if (!(await authorized(req, c))) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!storageReady(c)) return json({ ok: false, error: 'not_configured', leads: [] }, 503);
  try {
    const { leads } = await readInbox(c);
    return json({ ok: true, leads });
  } catch (e) {
    return json({ ok: false, error: e.message }, 502);
  }
}

export async function DELETE(req) {
  const c = cfg();
  if (!(await authorized(req, c))) return json({ ok: false, error: 'unauthorized' }, 401);
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
