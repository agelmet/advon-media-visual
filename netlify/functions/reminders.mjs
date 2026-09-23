// netlify/functions/reminders.mjs — the 08:30 client-reminder message (23 Sept 2026)
//
// Every morning (05:30 UTC = 08:30 Athens in summer, 07:30 in winter) it reads the ⏰ events of the Google Calendar
// «Advon Media» (GCAL_ICS_URL, see lib/reminders.js), takes the ones due today or still open from earlier days,
// and sends Angelo ONE message on Telegram + e-mail: the client, what they owe us, and a ready Viber text per
// client. Nothing goes to the clients themselves — Angelo copies the text into Viber. The same list sits on the
// CRM Home card («Client reminders», /api/reminders); a reminder disappears when he ticks it done there.
// Bookkeeping in the data repo: reminders/state.json {done:{uid:iso}, sent:{uid:'YYYY-MM-DD'}} — an open reminder
// is repeated every morning until it is ticked, but never twice on the same day.
// Manual run: GET https://advonmedia.com/.netlify/functions/reminders?key=<CHAT_AGENT_KEY or first 12 chars of CRM_AUTH_HASH>[&dry=1]

import { ghConf, ghReady, commit as ghCommit, readAtHead } from '../../lib/ghdata.js';
import { mailConf, sendEmail, sendTelegram } from '../../lib/chatcore.js';
import { STATE_PATH, fetchReminders, withState, reminderDigest, todayAthens } from '../../lib/reminders.js';

export const config = { schedule: '30 5 * * *' };

export default async (req) => {
  const url = new URL(req.url);
  const manual = url.searchParams.get('key');
  if (manual !== null) {
    const want = String(process.env.CRM_AUTH_HASH || '').slice(0, 12);
    const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(manual)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    const agentOk = h === '9bdf28e5bfba580df30a7b218900fa53dc3fba6e8a1317df8e8c2326080ac38a';
    if (!agentOk && (!want || manual !== want)) return new Response('forbidden', { status: 403 });
  }
  const dry = url.searchParams.get('dry') === '1';
  const conf = ghConf();
  const mc = mailConf();
  const canTg = !!(mc.tgToken && mc.tgChat), canMail = !!mc.resendKey;
  const report = { at: new Date().toISOString(), telegram: canTg, email: canMail, due: 0, sent: '', skipped: '' };
  let state = { done: {}, sent: {} };
  try { const r = ghReady(conf) ? await readAtHead(conf, STATE_PATH) : null; if (r && r.text) { const s = JSON.parse(r.text); if (s && typeof s === 'object') state = { done: s.done || {}, sent: s.sent || {} }; } } catch (e) { report.stateError = e.message; }
  let list;
  try { list = await fetchReminders(); } catch (e) { report.error = e.message; console.log(JSON.stringify(report)); return Response.json(report, { status: 502 }); }
  const today = todayAthens();
  const items = withState(list, state);
  // due = not done, day ≤ today, and not already sent today
  const due = items.filter((r) => !r.done && r.day <= today && state.sent[r.uid] !== today);
  report.due = due.length;
  if (!due.length) { report.skipped = 'nothing due'; console.log(JSON.stringify(report)); return Response.json(report); }
  const note = reminderDigest(due, today);
  if (dry) { report.sent = '[dry] ' + note.subject; report.preview = note.text; return Response.json(report); }
  const a = canTg ? await sendTelegram(mc, note.tg, { html: true, buttons: note.buttons }) : { ok: false, why: 'no telegram' };
  const b = canMail ? await sendEmail(mc, mc.notifyTo, note.subject, note.text, note.html) : { ok: false, why: 'no email' };
  report.sent = `${a.ok ? 'telegram' : ''}${a.ok && b.ok ? '+' : ''}${b.ok ? 'email' : ''}`;
  report.skipped = [a.why, b.why].filter(Boolean).join('; ');
  if ((a.ok || b.ok) && ghReady(conf)) {
    try {
      await ghCommit(conf, `reminders: ${due.length} sent ${today}`, async (ctx) => {
        const { data } = await ctx.readJson(STATE_PATH, {});
        const st = data && typeof data === 'object' ? data : {};
        st.done = st.done || {}; st.sent = st.sent || {};
        due.forEach((r) => { st.sent[r.uid] = today; });
        return [{ path: STATE_PATH, content: JSON.stringify(st, null, 1) }];
      });
    } catch (e) { report.stateError = e.message; }
  }
  console.log(JSON.stringify(report));
  return Response.json(report);
};
