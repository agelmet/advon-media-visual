// netlify/functions/chat-notify.mjs — the Chats notifier (16 Sept 2026)
//
// Every 5 minutes it reads chats/index.json in the private data repo and sends what is owed:
//   1. a client wrote and Angelo has not been told           → Telegram (+ e-mail to LEAD_NOTIFY_TO)
//   2. Angelo/Claude wrote and the client has not seen it    → e-mail to the client with the text + their link
//   3. we wrote last and the client has been silent 3+ days  → a gentle stage-aware reminder e-mail (max 2, 3 days apart)
//   4. chats/outbox.json                                     → pings queued by the chat agent (it can only reach GitHub)
// It then writes the bookkeeping fields (angeloNotifiedAt, clientNotifiedAt, remindersSent, lastReminderAt, log)
// back in ONE commit. Nothing is sent twice: every send is keyed to the message time it covered.
// Needs in Netlify: RESEND_API_KEY (+ optional CHAT_FROM, CHAT_REPLY_TO, LEAD_NOTIFY_TO), TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
// Manual run: GET https://advonmedia.com/.netlify/functions/chat-notify?key=<first 12 chars of CRM_AUTH_HASH>[&dry=1]

import { ghConf, ghReady, commit as ghCommit } from '../../lib/ghdata.js';
import { INDEX_PATH, OUTBOX_PATH, SITE_URL, STAGE_EL, currentHead, forgetHead, getIndex, getMessages, readChatJson, mailConf, emailOk, sendEmail, sendTelegram, newMessageMail, reminderMail, chatLink } from '../../lib/chatcore.js';

export const config = { schedule: '*/5 * * * *' };

const DAY = 86400000;
const REMIND_AFTER = 3 * DAY;
const REMIND_MAX = 2;
const GRACE = 90 * 1000;              // let Angelo finish a burst of messages before the e-mail goes
const nowIso = () => new Date().toISOString();

export default async (req) => {
  const url = new URL(req.url);
  const manual = url.searchParams.get('key');
  if (manual !== null) {
    const want = String(process.env.CRM_AUTH_HASH || '').slice(0, 12);
    if (!want || manual !== want) return new Response('forbidden', { status: 403 });
  }
  const dry = url.searchParams.get('dry') === '1';
  const conf = ghConf();
  if (!ghReady(conf)) return Response.json({ error: 'storage not configured' }, { status: 503 });
  const mc = mailConf();
  const canTg = !!(mc.tgToken && mc.tgChat), canMail = !!mc.resendKey;
  const report = { at: nowIso(), telegram: canTg, email: canMail, sent: [], skipped: [] };

  await currentHead(conf, true);
  const idx = await getIndex(conf);
  const outbox = await readChatJson(conf, 'outbox.json', []);
  const patch = new Map();      // slug → fields to merge
  const upd = (t, f) => { Object.assign(t, f); patch.set(t.slug, { ...(patch.get(t.slug) || {}), ...f }); };
  const log = (t, text) => upd(t, { log: (t.log || []).concat([{ at: nowIso(), by: 'system', text }]).slice(-30) });
  const now = Date.now();

  for (const t of idx) {
    if (t.archived) continue;
    const lastAt = Date.parse(t.lastAt || 0) || 0;

    // 1. client → Angelo
    if (t.lastFrom === 'client' && (t.angeloNotifiedAt || '') < (t.lastAt || '')) {
      if (!canTg && !canMail) { report.skipped.push(`${t.slug}: angelo (nothing configured)`); }
      else if (now - lastAt > 2 * DAY) { upd(t, { angeloNotifiedAt: t.lastAt }); }         // too old to ping now (keys were added later)
      else {
        const text = `💬 ${t.name} (${STAGE_EL[t.stage] || t.stage}) — ${t.unreadAdmin || 0} νέο${(t.unreadAdmin || 0) === 1 ? '' : 'α'}\n«${(t.lastText || '').slice(0, 300)}»\n${SITE_URL}/crm/#chats`;
        if (dry) { report.sent.push(`[dry] angelo ← ${t.slug}`); continue; }
        const a = await sendTelegram(mc, text);
        const b = canMail ? await sendEmail(mc, mc.notifyTo, `💬 ${t.name}: ${(t.lastText || '').slice(0, 60)}`, text) : { ok: false };
        if (a.ok || b.ok) { upd(t, { angeloNotifiedAt: t.lastAt }); report.sent.push(`angelo ← ${t.slug} (${a.ok ? 'telegram' : ''}${a.ok && b.ok ? '+' : ''}${b.ok ? 'email' : ''})`); }
        else report.skipped.push(`${t.slug}: angelo (${a.why}; ${b.why || 'no email'})`);
      }
    }

    // 2. Angelo/Claude → client e-mail (if they already opened the page and saw it, there is nothing to send)
    if (t.lastFrom !== 'client' && !(t.unreadClient || 0) && (t.clientNotifiedAt || '') < (t.lastAt || '')) upd(t, { clientNotifiedAt: t.lastAt });
    if (t.lastFrom !== 'client' && (t.unreadClient || 0) > 0 && emailOk(t.email) && (t.clientNotifiedAt || '') < (t.lastAt || '') && now - lastAt > GRACE) {
      if (!canMail) report.skipped.push(`${t.slug}: client e-mail (no RESEND_API_KEY)`);
      else if (now - lastAt > 7 * DAY) upd(t, { clientNotifiedAt: t.lastAt });
      else {
        const msgs = await getMessages(conf, t.slug);
        const since = t.clientNotifiedAt || '';
        const fresh = msgs.filter((m) => m.from !== 'client' && m.at > since);
        const text = fresh.map((m) => m.text).filter(Boolean).join('\n\n');
        const files = fresh.flatMap((m) => m.files || []);
        const mail = newMessageMail(t, text, files);
        if (dry) { report.sent.push(`[dry] client ${t.slug}`); continue; }
        const r = await sendEmail(mc, t.email, mail.subject, mail.text, mail.html);
        if (r.ok) { upd(t, { clientNotifiedAt: t.lastAt }); log(t, `E-mail στον πελάτη για ${fresh.length} νέο${fresh.length === 1 ? '' : 'α'} μήνυμα`); report.sent.push(`client ${t.slug} (${fresh.length} msg)`); }
        else report.skipped.push(`${t.slug}: client e-mail (${r.why})`);
      }
    }

    // 3. reminders — we wrote last, silence for 3+ days, not live
    const lastRem = Date.parse(t.lastReminderAt || 0) || 0;
    if (t.lastFrom !== 'client' && t.stage !== 'live' && emailOk(t.email) && canMail && now - lastAt >= REMIND_AFTER && (t.remindersSent || 0) < REMIND_MAX && now - lastRem >= REMIND_AFTER && (t.clientNotifiedAt || '') >= (t.lastAt || '')) {
      const mail = reminderMail(t);
      if (mail) {
        if (dry) { report.sent.push(`[dry] reminder ${t.slug}`); continue; }
        const r = await sendEmail(mc, t.email, mail.subject, mail.text, mail.html);
        if (r.ok) {
          const n = (t.remindersSent || 0) + 1;
          upd(t, { remindersSent: n, lastReminderAt: nowIso() });
          log(t, `Υπενθύμιση e-mail #${n} (${STAGE_EL[t.stage] || t.stage})`);
          report.sent.push(`reminder ${t.slug} #${n}`);
          await sendTelegram(mc, `🔔 Υπενθύμιση #${n} στάλθηκε: ${t.name} (${STAGE_EL[t.stage] || t.stage}) — σιωπή από ${String(t.lastAt).slice(0, 10)}`);
        } else report.skipped.push(`${t.slug}: reminder (${r.why})`);
      }
    }
  }

  // 4. outbox — pings queued by the chat agent
  let outChanged = false;
  const box = Array.isArray(outbox) ? outbox : [];
  for (const o of box) {
    if (o.sentAt) continue;
    if (dry) { report.sent.push(`[dry] outbox ${o.kind}`); continue; }
    let ok = false;
    if (o.kind === 'angelo') { const a = await sendTelegram(mc, o.text); const b = canMail ? await sendEmail(mc, mc.notifyTo, o.subject || 'Advon — Chat agent', o.text) : { ok: false }; ok = a.ok || b.ok; }
    else if (o.kind === 'client' && o.slug) { const t = idx.find((x) => x.slug === o.slug); if (t && emailOk(t.email) && canMail) { const r = await sendEmail(mc, t.email, o.subject || 'Μήνυμα από την Advon Media', `${o.text}\n\n${chatLink(t)}`, undefined); ok = r.ok; } }
    if (ok) { o.sentAt = nowIso(); outChanged = true; report.sent.push(`outbox ${o.kind}${o.slug ? ' ' + o.slug : ''}`); }
    else if (!canTg && !canMail) { report.skipped.push(`outbox ${o.kind}: nothing configured`); break; }
  }
  const cutoff = now - 30 * DAY;
  const kept = box.filter((o) => !o.sentAt || Date.parse(o.sentAt) > cutoff).slice(-200);
  if (kept.length !== box.length) outChanged = true;

  // write back
  if (!dry && (patch.size || outChanged)) {
    try {
      await ghCommit(conf, `chat: notifier — ${report.sent.length} sent`, async (ctx) => {
        const files = [];
        if (patch.size) {
          const { data } = await ctx.readJson(INDEX_PATH, []);
          const list = Array.isArray(data) ? data : [];
          for (const [slug, f] of patch) { const t = list.find((x) => x.slug === slug); if (t) Object.assign(t, f); }
          files.push({ path: INDEX_PATH, content: JSON.stringify(list, null, 1) });
        }
        if (outChanged) files.push({ path: OUTBOX_PATH, content: JSON.stringify(kept, null, 1) });
        return files;
      });
      forgetHead();
    } catch (e) { report.error = e.message; }
  }
  console.log(JSON.stringify({ sent: report.sent, skipped: report.skipped, telegram: canTg, email: canMail, error: report.error || null }));
  return Response.json(report);
};
