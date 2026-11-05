// app/api/form/route.js — the form / quiz relay for CLIENT sites (5 Nov 2026)
//
//   GET  /api/form?stamp=1          (public, CORS) — the signed stamp the page fetches when the visitor starts
//   POST /api/form                  (public, CORS) — { site, kind, name, phone, email?, message?, answers[], result?, page, stamp, _gotcha }
//
// The answers are e-mailed through Resend from forms@advonmedia.com to the client's own inbox, which comes ONLY
// from lib/clientforms.js (never from the request). Robots are caught exactly like on /api/lead (hidden field,
// signed stamp ≥ 3 s, links / foreign script / spam phrases) and answered «ok» without any e-mail being sent.
// Nothing is stored: the e-mail in the client's inbox is the only copy.
// Needs: RESEND_API_KEY (already set for the chats/leads). Optional: CLIENT_FORMS_FROM, CLIENT_FORMS_BCC.

import { makeStamp, checkStamp, contentVerdict, phoneVerdict, tooMany, clientIp } from '@/lib/antispam';
import { formSite, originOk, anyClientOrigin } from '@/lib/clientforms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 160;

function cors(origin) {
  const h = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', Vary: 'Origin' };
  if (anyClientOrigin(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type';
    h['Access-Control-Max-Age'] = '86400';
  }
  return h;
}
const json = (origin, body, status = 200) => new Response(JSON.stringify(body), { status, headers: cors(origin) });
const fakeOk = (origin) => json(origin, { ok: true });

export async function OPTIONS(req) {
  return new Response(null, { status: 204, headers: cors(req.headers.get('origin') || '') });
}

export async function GET(req) {
  const origin = req.headers.get('origin') || '';
  const url = new URL(req.url);
  if (url.searchParams.get('stamp') === '1') return json(origin, { ok: true, stamp: makeStamp() });
  return json(origin, { ok: false, error: 'not_found' }, 404);
}

function build(site, body) {
  const answers = (Array.isArray(body.answers) ? body.answers : []).slice(0, 30).map((a) => ({
    q: clean(a && a.q, 300), a: clean(a && a.a, 300),
  })).filter((a) => a.q);
  const pv = phoneVerdict(clean(body.phone, 40));
  return {
    kind: clean(body.kind, 40) || 'form',
    title: clean(body.title, 120),
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    phoneOk: pv.ok,
    email: clean(body.email, 160).toLowerCase(),
    message: clean(body.message, 3000),
    result: clean(body.result, 200),
    resultText: clean(body.resultText, 800),
    lang: clean(body.lang, 5) || 'el',
    page: clean(body.page, 300),
    answers,
    at: new Date(),
  };
}

function mail(site, f) {
  const el = f.lang !== 'en';
  const what = f.title || (f.kind === 'quiz' ? (el ? 'Τεστ από την ιστοσελίδα' : 'Website quiz') : (el ? 'Μήνυμα από την ιστοσελίδα' : 'Website message'));
  const when = f.at.toLocaleString('el-GR', { timeZone: 'Europe/Athens', dateStyle: 'medium', timeStyle: 'short' });
  const subject = `${what} — ${f.name || (el ? 'Επισκέπτης' : 'Visitor')}${f.phone ? ` (${f.phone})` : ''}`;
  const rows = f.answers.map((a, i) => `${i + 1}. ${a.q}\n   → ${a.a}`).join('\n');
  const text = [
    `${what}`, '',
    f.name ? `Όνομα: ${f.name}` : '',
    f.phone ? `Τηλέφωνο: ${f.phone}` : '',
    f.email ? `Email: ${f.email}` : '',
    '',
    rows ? `Απαντήσεις:\n${rows}` : '',
    f.result ? `\nΑποτέλεσμα που είδε ο επισκέπτης: ${f.result}${f.resultText ? ` — ${f.resultText}` : ''}` : '',
    f.message ? `\nΜήνυμα:\n${f.message}` : '',
    '',
    `Ώρα: ${when}`,
    f.page ? `Σελίδα: ${f.page}` : '',
    '',
    f.email ? 'Πατήστε «Απάντηση» για να απαντήσετε απευθείας στον επισκέπτη.' : 'Ο επισκέπτης δεν άφησε e-mail — επικοινωνήστε τηλεφωνικά.',
    '— Στάλθηκε από τη φόρμα της ιστοσελίδας σας · Advon Media',
  ].filter((x) => x !== '').join('\n');

  const tr = (k, v) => `<tr><td style="padding:8px 14px 8px 0;color:#5b6b73;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-size:15px;color:#0f2430">${v}</td></tr>`;
  const qa = f.answers.map((a, i) => `<tr><td style="padding:10px 0;border-top:1px solid #e4eef0"><div style="font-size:13px;color:#5b6b73">${i + 1}. ${esc(a.q)}</div><div style="font-size:15px;color:#0f2430;font-weight:600;margin-top:3px">${esc(a.a)}</div></td></tr>`).join('');
  const html = `<!doctype html><html><body style="margin:0;background:#f4f8f8;font-family:-apple-system,Segoe UI,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4eef0">
<tr><td style="background:#0b3348;padding:22px 26px;color:#ffffff"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7fd8e0">${esc(site.name)} · ιστοσελίδα</div><div style="font-size:21px;margin-top:6px">${esc(what)}</div></td></tr>
<tr><td style="padding:22px 26px 6px"><table role="presentation" cellpadding="0" cellspacing="0">
${f.name ? tr('Όνομα', esc(f.name)) : ''}${f.phone ? tr('Τηλέφωνο', `<a href="tel:${esc(f.phone.replace(/[^\d+]/g, ''))}" style="color:#007d89;font-weight:600">${esc(f.phone)}</a>`) : ''}${f.email ? tr('Email', `<a href="mailto:${esc(f.email)}" style="color:#007d89">${esc(f.email)}</a>`) : ''}${tr('Ώρα', esc(when))}
</table></td></tr>
${f.result ? `<tr><td style="padding:10px 26px"><div style="background:#e9f6f7;border-left:4px solid #00a3b1;border-radius:8px;padding:12px 16px"><div style="font-size:12px;color:#5b6b73;text-transform:uppercase;letter-spacing:.1em">Αποτέλεσμα που είδε ο επισκέπτης</div><div style="font-size:16px;font-weight:600;color:#0e5878;margin-top:4px">${esc(f.result)}</div></div></td></tr>` : ''}
${qa ? `<tr><td style="padding:6px 26px 10px"><div style="font-size:12px;color:#5b6b73;text-transform:uppercase;letter-spacing:.1em;margin:8px 0 2px">Απαντήσεις</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${qa}</table></td></tr>` : ''}
${f.message ? `<tr><td style="padding:6px 26px 10px"><div style="font-size:12px;color:#5b6b73;text-transform:uppercase;letter-spacing:.1em">Μήνυμα</div><div style="font-size:15px;color:#0f2430;white-space:pre-wrap;margin-top:6px">${esc(f.message)}</div></td></tr>` : ''}
<tr><td style="padding:14px 26px 24px;font-size:13px;color:#5b6b73">${f.email ? 'Πατήστε «Απάντηση» για να απαντήσετε απευθείας στον επισκέπτη.' : 'Ο επισκέπτης δεν άφησε e-mail — επικοινωνήστε τηλεφωνικά.'}</td></tr>
<tr><td style="padding:14px 26px;background:#f4f8f8;font-size:12px;color:#8a989e">Στάλθηκε από τη φόρμα της ιστοσελίδας σας · <a href="https://advonmedia.com" style="color:#8a989e">Advon Media</a></td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

export async function POST(req) {
  const origin = req.headers.get('origin') || '';
  const ip = clientIp(req);
  if (tooMany(`cf:${ip}`, 8, 600e3)) return json(origin, { ok: false, error: 'rate_limited' }, 429);

  let body;
  try { body = await req.json(); } catch { return json(origin, { ok: false, error: 'bad_request' }, 400); }
  body = body && typeof body === 'object' ? body : {};

  const site = formSite(body.site);
  if (!site || !originOk(site, origin)) return json(origin, { ok: false, error: 'unknown_site' }, 403);

  // robots: hidden field, missing/forged/too-fast stamp, links / foreign script / spam phrases → «ok», nothing sent
  if (clean(body._gotcha, 50) || clean(body.website, 50)) return fakeOk(origin);
  if (!checkStamp(body.stamp).ok) return fakeOk(origin);
  if (contentVerdict({ name: body.name, message: body.message, email: body.email })) return fakeOk(origin);
  if (tooMany(`cf-site:${site.id}`, 40, 3600e3)) return json(origin, { ok: false, error: 'rate_limited' }, 429);

  const f = build(site, body);
  if (f.name.length < 2) return json(origin, { ok: false, error: 'invalid_name' }, 400);
  if (!f.phone && !f.email) return json(origin, { ok: false, error: 'need_contact' }, 400);
  if (f.phone && !f.phoneOk) return json(origin, { ok: false, error: 'invalid_phone' }, 400);
  if (f.email && !emailOk(f.email)) return json(origin, { ok: false, error: 'invalid_email' }, 400);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json(origin, { ok: false, error: 'not_configured' }, 503);
  const m = mail(site, f);
  const fromAddr = process.env.CLIENT_FORMS_FROM || 'forms@advonmedia.com';
  const payload = {
    from: `${site.name} · ιστοσελίδα <${fromAddr}>`,
    to: site.to,
    subject: m.subject,
    text: m.text,
    html: m.html,
  };
  if (f.email) payload.reply_to = f.email;
  const bcc = [...(site.bcc || []), ...(process.env.CLIENT_FORMS_BCC ? [process.env.CLIENT_FORMS_BCC] : [])];
  if (bcc.length) payload.bcc = bcc;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) { console.error('[form] resend', r.status, (await r.text()).slice(0, 300)); return json(origin, { ok: false, error: 'send_failed' }, 502); }
  } catch (e) {
    console.error('[form] resend failed', e?.message);
    return json(origin, { ok: false, error: 'send_failed' }, 502);
  }
  return json(origin, { ok: true });
}
