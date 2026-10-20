// app/api/verify/route.js — «prove the e-mail is yours» before the booking calendar opens (20 Oct 2026)
//
// Why: on 20 Oct 2026 someone booked the free call twice with an e-mail Gmail says does not exist and a phone
// that never rang. The calendar (homepage #contact and /dorean) now opens only after the visitor types the
// 6-digit code we e-mail them. Fake or mistyped addresses never get the code.
//
//   POST /api/verify {action:'send', email, lang}        → e-mails the code, answers {ok, token}
//   POST /api/verify {action:'check', token, code}        → {ok, email, verified}   (verified = 30-day proof)
//   POST /api/verify {action:'known', verified}           → {ok, email} if the 30-day proof is still good
//
// Nothing secret is stored: the code is only in the e-mail, the browser keeps a signed token (lib/antispam.js).
// A correct code also files the e-mail in bookings/verified.json (data repo) so the booking guard
// (netlify/functions/booking-guard.mjs) can warn Angelo about bookings made straight on the Zoho link
// with an e-mail that was never confirmed.

import { newCode, checkCode, makeVerified, checkVerified, normEmail, emailShapeOk, tooMany, clientIp, antispamReady } from '@/lib/antispam';
import { mailConf, sendEmail } from '@/lib/chatcore';
import { ghConf, ghReady, mutateJson } from '@/lib/ghdata';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VERIFIED_PATH = 'bookings/verified.json';
const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', 'Content-Type': 'application/json; charset=utf-8' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

function codeMail(code, lang) {
  const el = lang !== 'en';
  const subject = el ? `Ο κωδικός σας: ${code} — Advon Media` : `Your code: ${code} — Advon Media`;
  const text = el
    ? `Ο κωδικός σας για να δείτε τις διαθέσιμες ώρες της δωρεάν κλήσης: ${code}\n\nΙσχύει για 10 λεπτά.\n\nΑν δεν το ζητήσατε εσείς, απλώς αγνοήστε αυτό το email.\n\nAdvon Media · advonmedia.com`
    : `Your code to see the available times for the free call: ${code}\n\nIt is valid for 10 minutes.\n\nIf you did not ask for it, simply ignore this email.\n\nAdvon Media · advonmedia.com`;
  const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:${F};color:#16181d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
<tr><td style="background:#050608;padding:20px 28px;color:#ffffff;font-weight:800;font-size:17px;letter-spacing:.02em">Advon Media</td></tr>
<tr><td style="padding:28px 28px 8px;font-size:16px;line-height:1.55">${esc(el ? 'Ο κωδικός σας για να δείτε τις διαθέσιμες ώρες της δωρεάν κλήσης:' : 'Your code to see the available times for the free call:')}</td></tr>
<tr><td style="padding:10px 28px 6px"><div style="font-size:38px;font-weight:800;letter-spacing:.32em;color:#050608;background:#eef9fe;border:1px solid #cdeefc;border-radius:12px;padding:16px 0;text-align:center">${esc(code)}</div></td></tr>
<tr><td style="padding:14px 28px 26px;font-size:14px;line-height:1.55;color:#5b616e">${esc(el ? 'Ισχύει για 10 λεπτά. Αν δεν το ζητήσατε εσείς, απλώς αγνοήστε αυτό το email.' : 'It is valid for 10 minutes. If you did not ask for it, simply ignore this email.')}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #eef0f3;font-size:12px;color:#8a909c">Advon Media · <a href="https://advonmedia.com" style="color:#1a8fc4;text-decoration:none">advonmedia.com</a></td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

async function remember(email) {
  const conf = ghConf();
  if (!ghReady(conf)) return;
  try {
    await mutateJson(conf, VERIFIED_PATH, (d) => {
      const map = d && typeof d === 'object' && !Array.isArray(d) ? d : {};
      map[email] = new Date().toISOString();
      const keys = Object.keys(map);
      if (keys.length > 3000) keys.sort((a, b) => String(map[a]).localeCompare(String(map[b]))).slice(0, keys.length - 3000).forEach((k) => delete map[k]);
      return map;
    }, `booking e-mail confirmed`, {});
  } catch (e) { console.error('[verify] remember failed', e?.message); }
}

export async function POST(req) {
  if (!antispamReady()) return json({ ok: false, error: 'not_configured' }, 503);
  let b = {};
  try { b = await req.json(); } catch { return json({ ok: false, error: 'bad_request' }, 400); }
  const ip = clientIp(req);
  const action = String(b.action || '');

  if (action === 'send') {
    const email = normEmail(b.email);
    if (!emailShapeOk(email)) return json({ ok: false, error: 'bad_email' }, 400);
    if (tooMany(`vs:ip:${ip}`, 6, 15 * 60e3) || tooMany(`vs:em:${email}`, 4, 15 * 60e3)) return json({ ok: false, error: 'too_many' }, 429);
    const mc = mailConf();
    if (!mc.resendKey) return json({ ok: false, error: 'not_configured' }, 503);
    const { code, token } = newCode(email);
    const m = codeMail(code, b.lang === 'en' ? 'en' : 'el');
    // The code e-mail comes from Advon Media; a reply goes to Angelo's inbox like every other message.
    const r = await sendEmail({ ...mc, from: process.env.VERIFY_FROM || 'Advon Media <angelos@advonmedia.com>' }, email, m.subject, m.text, m.html);
    if (!r.ok) {
      console.error('[verify] send failed', r.why);
      // Resend refuses an address it knows cannot receive mail («invalid»/«not a valid email») — say so plainly.
      return json({ ok: false, error: /valid|domain|recipient/i.test(r.why) ? 'bad_email' : 'send_failed' }, /valid|domain|recipient/i.test(r.why) ? 400 : 502);
    }
    return json({ ok: true, token });
  }

  if (action === 'check') {
    if (tooMany(`vc:ip:${ip}`, 20, 15 * 60e3) || tooMany(`vc:tk:${String(b.token || '').slice(0, 40)}`, 6, 15 * 60e3)) return json({ ok: false, error: 'too_many' }, 429);
    const v = checkCode(b.token, b.code);
    if (!v.ok) return json({ ok: false, error: v.why === 'expired' ? 'expired' : 'wrong_code' }, 400);
    await remember(v.email);
    return json({ ok: true, email: v.email, verified: makeVerified(v.email) });
  }

  if (action === 'known') {
    const v = checkVerified(b.verified);
    return json(v.ok ? { ok: true, email: v.email } : { ok: false });
  }

  return json({ ok: false, error: 'bad_request' }, 400);
}
