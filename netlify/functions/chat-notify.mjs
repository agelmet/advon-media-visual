// netlify/functions/chat-notify.mjs — the Chats notifier (16 Sept 2026)
//
// Every 5 minutes it reads chats/index.json in the private data repo and sends what is owed:
//   1. a client wrote and Angelo has not been told           → Telegram (+ e-mail to LEAD_NOTIFY_TO)
//   2. Angelo/Claude wrote and the client has not seen it    → e-mail to the client with the text + their link
//   3. we wrote last and the client has been silent 3+ days  → a gentle stage-aware reminder e-mail (max 2, 3 days apart)
//   4. chats/outbox.json                                     → pings queued by the chat agent (it can only reach GitHub)
//   5. Claude left a reply waiting for approval (t.suggest)  → «APPROVAL NEEDED — <client>» to Angelo: what the client asked,
//      what was done / is intended, the exact reply — Telegram + e-mail, once per suggestion (suggestNotifiedAt)
// Every message to Angelo starts with the CLIENT'S NAME and is built in lib/chatcore.js (clientWroteNote, approvalNote,
// quietNote, reminderSentNote, agentNote); every client e-mail shares one layout (newMessageMail, reminderMail, plainClientMail).
// It then writes the bookkeeping fields (angeloNotifiedAt, clientNotifiedAt, remindersSent, lastReminderAt, log)
// back in ONE commit. Nothing is sent twice: every send is keyed to the message time it covered.
// Needs in Netlify: RESEND_API_KEY (+ optional CHAT_FROM, CHAT_REPLY_TO, LEAD_NOTIFY_TO), TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
// Manual run: GET https://advonmedia.com/.netlify/functions/chat-notify?key=<CHAT_AGENT_KEY or first 12 chars of CRM_AUTH_HASH>[&dry=1]
//   &test=telegram → one test ping + diagnosis (bot name, which chats wrote to it) · &test=email → one test e-mail to LEAD_NOTIFY_TO

import { ghConf, ghReady, commit as ghCommit } from '../../lib/ghdata.js';
import { INDEX_PATH, OUTBOX_PATH, STAGE_EL, currentHead, forgetHead, getIndex, getMessages, readChatJson, mailConf, emailOk, sendEmail, sendTelegram, telegramDiag, newMessageMail, reminderMail, plainClientMail, clientWroteNote, approvalNote, quietNote, reminderSentNote, agentNote, politeHour } from '../../lib/chatcore.js';

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
    const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(manual)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    const agentOk = h === '9bdf28e5bfba580df30a7b218900fa53dc3fba6e8a1317df8e8c2326080ac38a';   // CHAT_AGENT_KEY (secrets.env)
    if (!agentOk && (!want || manual !== want)) return new Response('forbidden', { status: 403 });
  }
  const dry = url.searchParams.get('dry') === '1';
  // ?key=…&test=telegram → send one test ping now and show what Telegram says (bot name, chats that wrote to it)
  if (manual !== null && url.searchParams.get('test') === 'telegram') {
    const mc0 = mailConf();
    const d = await telegramDiag(mc0);
    const s = await sendTelegram(mc0, '✅ Advon Alerts: οι ειδοποιήσεις Telegram δουλεύουν.');
    return Response.json({ diag: d, send: s });
  }
  if (manual !== null && url.searchParams.get('test') === 'email') {
    const mc0 = mailConf();
    const s = await sendEmail(mc0, mc0.notifyTo, '✅ Advon Media — δοκιμή e-mail', 'Οι ειδοποιήσεις e-mail από το advonmedia.com δουλεύουν.');
    return Response.json({ from: mc0.from, to: mc0.notifyTo, send: s });
  }
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
  const polite = politeHour();

  const toAngelo = async (note, mail = true) => {
    const a = canTg ? await sendTelegram(mc, note.tg, { html: true, buttons: note.buttons }) : { ok: false, why: 'no telegram' };
    const b = mail && canMail && note.html ? await sendEmail(mc, mc.notifyTo, note.subject, note.text, note.html) : { ok: false, why: mail ? 'no email' : '' };
    return { ok: a.ok || b.ok, how: `${a.ok ? 'telegram' : ''}${a.ok && b.ok ? '+' : ''}${b.ok ? 'email' : ''}`, why: [a.why, b.why].filter(Boolean).join('; ') };
  };

  for (const t of idx) {
    if (t.archived) continue;
    const lastAt = Date.parse(t.lastAt || 0) || 0;

    // 1. client → Angelo
    if (t.lastFrom === 'client' && (t.angeloNotifiedAt || '') < (t.lastAt || '')) {
      if (!canTg && !canMail) { report.skipped.push(`${t.slug}: angelo (nothing configured)`); }
      else if (now - lastAt > 2 * DAY) { upd(t, { angeloNotifiedAt: t.lastAt }); }         // too old to ping now (keys were added later)
      else {
        if (dry) { report.sent.push(`[dry] angelo ← ${t.slug}`); continue; }
        // everything the client wrote since Angelo was last told (or last looked), not only the last line
        const since = [t.angeloNotifiedAt || '', t.adminSeenAt || ''].sort().pop();
        let fresh = [];
        try { fresh = (await getMessages(conf, t.slug)).filter((m) => m.from === 'client' && !m.deleted && m.at > since); } catch {}
        const r = await toAngelo(clientWroteNote(t, fresh));
        if (r.ok) { upd(t, { angeloNotifiedAt: t.lastAt }); report.sent.push(`angelo ← ${t.slug} (${r.how})`); }
        else report.skipped.push(`${t.slug}: angelo (${r.why})`);
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
        if (r.ok) { upd(t, { clientNotifiedAt: t.lastAt }); log(t, `E-mail στον πελάτη για ${fresh.length === 1 ? '1 νέο μήνυμα' : fresh.length + ' νέα μηνύματα'}`); report.sent.push(`client ${t.slug} (${fresh.length} msg)`); }
        else report.skipped.push(`${t.slug}: client e-mail (${r.why})`);
      }
    }

    // 3a. quiet for 3+ days and NO e-mail on the card → nothing can remind the client, so Angelo is told once (he nudges on Viber)
    if (polite && canTg && t.lastFrom !== 'client' && t.stage !== 'live' && !emailOk(t.email) && now - lastAt >= REMIND_AFTER && (t.quietPingAt || '') < (t.lastAt || '')) {
      if (dry) { report.sent.push(`[dry] quiet-no-email ${t.slug}`); }
      else {
        const a = await toAngelo(quietNote(t, Math.floor((now - lastAt) / DAY)), false);
        if (a.ok) { upd(t, { quietPingAt: t.lastAt }); log(t, 'Telegram στον Άγγελο: σιωπή χωρίς e-mail'); report.sent.push(`quiet-no-email ${t.slug}`); }
      }
    }

    // 3. reminders — we wrote last, silence for 3+ days, not live (09:00–20:00 Athens, never on a Sunday)
    const lastRem = Date.parse(t.lastReminderAt || 0) || 0;
    if (polite && t.lastFrom !== 'client' && t.stage !== 'live' && emailOk(t.email) && canMail && now - lastAt >= REMIND_AFTER && (t.remindersSent || 0) < REMIND_MAX && now - lastRem >= REMIND_AFTER && (t.clientNotifiedAt || '') >= (t.lastAt || '')) {
      const mail = reminderMail(t);
      if (mail) {
        if (dry) { report.sent.push(`[dry] reminder ${t.slug}`); continue; }
        const r = await sendEmail(mc, t.email, mail.subject, mail.text, mail.html);
        if (r.ok) {
          const n = (t.remindersSent || 0) + 1;
          upd(t, { remindersSent: n, lastReminderAt: nowIso() });
          log(t, `Υπενθύμιση e-mail #${n} (${STAGE_EL[t.stage] || t.stage})`);
          report.sent.push(`reminder ${t.slug} #${n}`);
          await toAngelo(reminderSentNote(t, n), false);
        } else report.skipped.push(`${t.slug}: reminder (${r.why})`);
      }
    }
  }

  // 5. a reply prepared by Claude waits for Angelo's OK → one clear «approval needed» message per suggestion
  for (const t of idx) {
    if (t.archived || !t.suggest || !t.suggest.text || !t.suggest.at) continue;
    if ((t.suggestNotifiedAt || '') >= t.suggest.at) continue;
    if (now - (Date.parse(t.suggest.at) || 0) > 3 * DAY) { upd(t, { suggestNotifiedAt: t.suggest.at }); continue; }
    if (!canTg && !canMail) { report.skipped.push(`${t.slug}: approval (nothing configured)`); continue; }
    if (dry) { report.sent.push(`[dry] approval ${t.slug}`); continue; }
    let asked = '';
    if (!t.suggest.asked) {
      try {
        const msgs = (await getMessages(conf, t.slug)).filter((m) => !m.deleted);
        let i = msgs.length - 1; while (i >= 0 && msgs[i].from !== 'client') i--;
        const tail = []; while (i >= 0 && msgs[i].from === 'client') { tail.unshift(msgs[i]); i--; }
        asked = tail.map((m) => m.text || (m.files && m.files.length ? '📎 ' + m.files.map((f) => f.name).join(', ') : '')).filter(Boolean).join('\n\n');
      } catch {}
    }
    const r = await toAngelo(approvalNote(t, asked));
    if (r.ok) { upd(t, { suggestNotifiedAt: t.suggest.at }); log(t, 'Ζητήθηκε έγκριση από τον Άγγελο (Telegram/e-mail)'); report.sent.push(`approval ${t.slug} (${r.how})`); }
    else report.skipped.push(`${t.slug}: approval (${r.why})`);
  }

  // 4. outbox — pings queued by the chat agent
  let outChanged = false;
  const box = Array.isArray(outbox) ? outbox : [];
  for (const o of box) {
    if (o.sentAt) continue;
    if (dry) { report.sent.push(`[dry] outbox ${o.kind}`); continue; }
    let ok = false;
    if (o.kind === 'angelo') { ok = (await toAngelo(agentNote(o, idx))).ok; }
    else if (o.kind === 'client' && o.slug) { const t = idx.find((x) => x.slug === o.slug); if (t && emailOk(t.email) && canMail) { const m = plainClientMail(t, o.subject, o.text || ''); const r = await sendEmail(mc, t.email, m.subject, m.text, m.html); ok = r.ok; } }
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
        if (outChanged) {
          const { data: liveBox } = await ctx.readJson(OUTBOX_PATH, []);
          const mine = new Map(kept.map((o) => [o.id, o]));
          const gone = new Set(box.filter((o) => !kept.includes(o)).map((o) => o.id));
          const merged = (Array.isArray(liveBox) ? liveBox : []).filter((o) => !gone.has(o.id)).map((o) => (mine.has(o.id) && mine.get(o.id).sentAt ? { ...o, sentAt: mine.get(o.id).sentAt } : o));
          files.push({ path: OUTBOX_PATH, content: JSON.stringify(merged.slice(-200), null, 1) });
        }
        return files;
      });
      forgetHead();
    } catch (e) { report.error = e.message; }
  }
  console.log(JSON.stringify({ sent: report.sent, skipped: report.skipped, telegram: canTg, email: canMail, error: report.error || null }));
  return Response.json(report);
};
