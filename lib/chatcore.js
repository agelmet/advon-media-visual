// lib/chatcore.js — shared by app/api/chat/route.js and netlify/functions/chat-notify.mjs (16 Sept 2026)
//
//   • stages of a client website, as the client and the CRM see them
//   • FAST reads of chats/ in the data repo: one recursive tree listing per branch head, blobs cached by sha,
//     so a poll that finds nothing new costs ONE GitHub call and opening a thread costs at most one blob fetch
//   • e-mail (Resend) and Telegram senders + the Greek templates the notifier uses

import { ghFetch, head, entryAt, blobText, blobBuffer } from './ghdata.js';

export const DIR = 'chats';
export const INDEX_PATH = `${DIR}/index.json`;
export const OUTBOX_PATH = `${DIR}/outbox.json`;
export const SITE_URL = 'https://advonmedia.com';
export const STAGES = ['yliko', 'draft', 'changes', 'live'];
export const STAGE_EL = { yliko: 'Υλικό', draft: 'Πρώτο draft', changes: 'Αλλαγές', live: 'Live' };
export const normStage = (s) => (s === 'payment' ? 'changes' : STAGES.includes(s) ? s : 'yliko');

// ---------- cached reads ----------
const C = { head: null, at: 0, tree: null, blobs: new Map(), order: [] };
const BLOB_CACHE_MAX = 400;

async function headSha(conf) {
  const r = await ghFetch(conf, `git/ref/heads/${encodeURIComponent(conf.branch)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  return (await r.json()).object.sha;
}
// The current head (memoised for 4 s so every open chat page together costs one GitHub call per 4 s —
// GitHub allows 5,000 calls an hour; at 1.5 s a dozen clients online at once could have used them up).
export async function currentHead(conf, force = false) {
  if (!force && C.head && Date.now() - C.at < 4000) return C.head;
  const sha = await headSha(conf);
  C.at = Date.now();
  if (sha !== C.head) { C.head = sha; C.tree = null; }
  return sha;
}
export function forgetHead() { C.head = null; C.tree = null; }

// path (relative to chats/) → {sha,size}; one recursive listing per head.
async function chatTree(conf) {
  await currentHead(conf);
  if (C.tree) return C.tree;
  const map = new Map();
  const h = await head(conf);
  if (h) {
    const e = await entryAt(conf, h.tree, DIR);
    if (e && e.type === 'tree') {
      const r = await ghFetch(conf, `git/trees/${e.sha}?recursive=1`);
      if (!r.ok) throw new Error(`GitHub ${r.status}`);
      for (const x of (await r.json()).tree || []) if (x.type === 'blob') map.set(x.path, { sha: x.sha, size: x.size });
    }
  }
  C.tree = map;
  return map;
}
export async function chatEntry(conf, relPath) { return (await chatTree(conf)).get(relPath) || null; }
export async function readChatJson(conf, relPath, fallback) {
  const e = await chatEntry(conf, relPath);
  if (!e) return fallback;
  if (C.blobs.has(e.sha)) return C.blobs.get(e.sha);
  let v = fallback;
  try { v = JSON.parse(await blobText(conf, e.sha)); } catch { v = fallback; }
  C.blobs.set(e.sha, v); C.order.push(e.sha);
  while (C.order.length > BLOB_CACHE_MAX) C.blobs.delete(C.order.shift());
  return v;
}
export async function readChatBuffer(conf, relPath) {
  const e = await chatEntry(conf, relPath);
  return e ? blobBuffer(conf, e.sha) : null;
}
export async function getIndex(conf) {
  const idx = await readChatJson(conf, 'index.json', []);
  const list = Array.isArray(idx) ? idx : [];
  list.forEach((t) => { t.stage = normStage(t.stage); });
  return list;
}
export const getMessages = async (conf, slug) => { const m = await readChatJson(conf, `${slug}/messages.json`, []); return Array.isArray(m) ? m : []; };
export const headNow = () => C.head;

// ---------- senders ----------
export function mailConf() {
  return {
    resendKey: process.env.RESEND_API_KEY,
    from: process.env.CHAT_FROM || 'Άγγελος · Advon Media <angelos@advonmedia.com>',
    replyTo: process.env.CHAT_REPLY_TO || 'advonmd@gmail.com',
    notifyTo: process.env.LEAD_NOTIFY_TO || 'advonmd@gmail.com',
    tgToken: process.env.TELEGRAM_BOT_TOKEN,
    tgChat: process.env.TELEGRAM_CHAT_ID,
  };
}
export const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || ''));
export async function sendEmail(mc, to, subject, text, html) {
  if (!mc.resendKey || !emailOk(to)) return { ok: false, why: 'no key or bad address' };
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${mc.resendKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: mc.from, to: [to], reply_to: mc.replyTo, subject, text, html }) });
    if (r.ok) return { ok: true, why: '' };
    let msg = ''; try { msg = (await r.json()).message || ''; } catch {}
    return { ok: false, why: `resend ${r.status} ${msg}`.trim() };
  } catch (e) { return { ok: false, why: e.message }; }
}
// Telegram. If the configured chat id is refused («chat not found» = the bot may not write to that id —
// usually the id belongs to another bot's chat or Start was never pressed), we look at who has actually
// written to THIS bot (getUpdates) and, when exactly one private chat has, use that id instead.
const TG = { chat: null, bot: null, lastDiag: null };
async function tgCall(token, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  let j = {}; try { j = await r.json(); } catch {}
  return { status: r.status, ok: r.ok && j.ok, json: j };
}
export async function telegramDiag(mc) {
  if (!mc.tgToken) return { configured: false };
  const me = await tgCall(mc.tgToken, 'getMe');
  const up = await tgCall(mc.tgToken, 'getUpdates', { limit: 50, allowed_updates: ['message'] });
  const chats = {};
  for (const u of (up.json.result || [])) { const c = (u.message || u.edited_message || {}).chat; if (c && c.type === 'private') chats[c.id] = c.first_name || c.username || ''; }
  const d = { configured: true, tokenValid: me.ok, bot: me.ok ? '@' + me.json.result.username : `token refused (${me.status})`, envChatId: String(mc.tgChat || ''), chatsThatWroteToBot: Object.keys(chats).map((id) => `${id}${chats[id] ? ' (' + chats[id] + ')' : ''}`), getUpdates: up.ok ? 'ok' : `error ${up.status} ${up.json.description || ''}` };
  TG.bot = d.bot; TG.lastDiag = d;
  return d;
}
// text may carry Telegram HTML (<b>, <i>, <code>, <blockquote>) when opts.html is true; opts.buttons = [{text,url}] puts
// link buttons under the message. If Telegram refuses the markup the same message goes out again as plain text,
// so a ping is never lost to a formatting slip.
export const tgEsc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tgPlain = (s) => String(s).replace(/<\/?(b|i|u|s|code|pre|blockquote)[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
export async function sendTelegram(mc, text, opts = {}) {
  if (!mc.tgToken || !mc.tgChat) return { ok: false, why: 'no telegram' };
  try {
    const chat = TG.chat || mc.tgChat;
    const body = (html) => {
      const b = { chat_id: chat, text: (html ? text : tgPlain(text)).slice(0, 4000), disable_web_page_preview: true };
      if (html) b.parse_mode = 'HTML';
      if (opts.buttons && opts.buttons.length) b.reply_markup = { inline_keyboard: [opts.buttons.slice(0, 3).map((x) => ({ text: x.text, url: x.url }))] };
      return b;
    };
    let r = await tgCall(mc.tgToken, 'sendMessage', body(!!opts.html));
    if (!r.ok && opts.html && r.status === 400 && /pars|entit|tag/i.test(r.json.description || '')) r = await tgCall(mc.tgToken, 'sendMessage', body(false));
    if (r.ok) return { ok: true, why: '' };
    const why1 = `telegram ${r.status} ${r.json.description || ''}`.trim();
    if (r.status === 400 || r.status === 403) {
      const d = await telegramDiag(mc);
      const ids = d.chatsThatWroteToBot.map((x) => x.split(' ')[0]);
      if (ids.length === 1 && ids[0] !== String(chat)) {
        TG.chat = ids[0];
        r = await tgCall(mc.tgToken, 'sendMessage', { ...body(false), chat_id: TG.chat });
        if (r.ok) return { ok: true, why: '', usedChat: TG.chat, note: `TELEGRAM_CHAT_ID should be ${TG.chat}` };
      }
      return { ok: false, why: `${why1} · bot ${d.bot} · env chat ${d.envChatId} · chats that wrote to the bot: ${d.chatsThatWroteToBot.join(', ') || 'none'}` };
    }
    return { ok: false, why: why1 };
  } catch (e) { return { ok: false, why: e.message }; }
}

// ---------- Athens clock: the right greeting, and no reminders at night or on Sundays ----------
export function athensNow(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', hour12: false, weekday: 'short' }).formatToParts(d).map((x) => [x.type, x.value]));
  return { hour: +p.hour % 24, weekday: p.weekday };
}
export const greeting = (d) => (athensNow(d).hour < 13 ? 'Καλημέρα' : 'Καλησπέρα');
export function politeHour(d) { const a = athensNow(d); return a.weekday !== 'Sun' && a.hour >= 9 && a.hour < 20; }


// =====================================================================================================
// TEMPLATES (20 Sept 2026 — rewritten so every message reads at a glance)
//   • to the CLIENT (Greek, Angelo's voice — warm, short, no pressure, never a word about payment):
//       newMessageMail · reminderMail · plainClientMail — one layout: where the website stands (4 steps),
//       the message, one button, one line about what to do next.
//   • to ANGELO (English like the CRM; whatever the client wrote stays as written):
//       clientWroteNote · approvalNote · quietNote · reminderSentNote · agentNote — each returns
//       { tg, buttons, subject, text, html }. The CLIENT'S NAME is always the first thing in the Telegram
//       message and in the e-mail subject, then the stage, then numbered blocks.
// =====================================================================================================
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
export const chatLink = (t) => `${SITE_URL}/c/${t.code}`;
export const crmLink = (t) => `${SITE_URL}/crm/${t && t.slug ? '#chat=' + t.slug : '#chats'}`;
const STAGE_EN = { yliko: 'Material', draft: 'First draft', changes: 'Changes', live: 'Live' };
const stageEn = (s) => STAGE_EN[normStage(s)] || s;
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
// Greek capitals carry no accents: «Σφυρή» → «ΣΦΥΡΗ», never «ΣΦΥΡΉ»
const upper = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().normalize('NFC');
const cut = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };

// message text → safe HTML: line breaks kept, links clickable, [label](#sheet) opens the chat page
function richText(text, link) {
  let h = esc(text);
  h = h.replace(/\[([^\]\n]{1,80})\]\(#(odigos|extras|yliko)\)/g, (_, label) => `<a href="${link}" style="color:#2F7FE0;font-weight:600">${label}</a>`);
  h = h.replace(/(^|[\s(])((?:https?:\/\/)[^\s<)]+)/g, (_, pre, u) => `${pre}<a href="${u}" style="color:#2F7FE0;word-break:break-all">${u}</a>`);
  return h.replace(/\r?\n/g, '<br>');
}
const plainText = (text) => String(text || '').replace(/\[([^\]\n]{1,80})\]\(#(odigos|extras|yliko)\)/g, '$1');

// ---------- the client layout ----------
// «Επόμενο βήμα» under every client e-mail — the same three buttons the chat page shows (21 Sept 2026)
const NEXT_STEP = {
  yliko: 'Στείλτε μας ό,τι έχετε (τίποτα δεν είναι υποχρεωτικό) και πατήστε «Ξεκινήστε την ιστοσελίδα μου» στη σελίδα συνομιλίας. Το πρώτο draft έρχεται σε 5–10 ημέρες.',
  draft: 'Δείτε το draft με την ησυχία σας. Γράψτε μας τις αλλαγές (1., 2., 3.) και πατήστε «Έστειλα όλες τις αλλαγές» — ή, αν είναι όπως το θέλετε, «Όλα καλά — πάμε live».',
  changes: 'Ελέγξτε όλη τη σελίδα μια φορά. Κι άλλες αλλαγές; Γράψτε τις και πατήστε «Έστειλα όλες τις αλλαγές». Όλα εντάξει; Πατήστε «Όλα καλά — πάμε live» και γράψτε μας το domain που θέλετε.',
  live: '',
};
export const NEXT_STEP_EL = NEXT_STEP;
function stageTrack(stage) {
  const cur = STAGES.indexOf(normStage(stage));
  const cells = STAGES.map((s, i) => {
    const done = i < cur, on = i === cur;
    const bg = on ? '#2F7FE0' : done ? '#DDEBFB' : '#F1F3F7', fg = on ? '#ffffff' : done ? '#2F7FE0' : '#9AA3B2';
    return `<td align="center" width="25%" style="padding:0 3px"><div style="background:${bg};color:${fg};border-radius:9px;padding:9px 2px;font:700 12px ${FONT};white-space:nowrap">${done ? '✓ ' : ''}${esc(STAGE_EL[s])}</div></td>`;
  }).join('');
  return `<p style="margin:0 0 8px;font:700 11px ${FONT};letter-spacing:.12em;color:#8A93A3">ΠΟΥ ΒΡΙΣΚΕΤΑΙ Η ΙΣΤΟΣΕΛΙΔΑ ΣΑΣ</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 -3px 22px"><tr>${cells}</tr></table>`;
}
function clientWrap(t, { preheader, title, bodyHtml, cta }) {
  const link = chatLink(t);
  const next = NEXT_STEP[normStage(t.stage)];
  const site = t.site && normStage(t.stage) !== 'yliko' ? (/^https?:\/\//.test(t.site) ? t.site : 'https://' + t.site) : '';
  return `<div style="background:#F3F5F9;padding:24px 12px">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader || '')}</span>
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #E6E9F0;font-family:${FONT};color:#10141F;line-height:1.55">
    <div style="background:#0B0E12;padding:18px 26px"><span style="font:800 13px ${FONT};letter-spacing:.18em;text-transform:uppercase;color:#ffffff">Advon Media</span><span style="font:600 12px ${FONT};color:#8FB8F2;padding-left:10px">η ιστοσελίδα σας</span></div>
    <div style="padding:26px 26px 8px">
      <h1 style="font:800 21px ${FONT};margin:0 0 18px;color:#10141F">${esc(title)}</h1>
      ${stageTrack(t.stage)}
      ${bodyHtml}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px"><tr><td style="background:#2F7FE0;border-radius:12px"><a href="${link}" style="display:inline-block;padding:14px 26px;font:700 15px ${FONT};color:#ffffff;text-decoration:none">${esc(cta)} →</a></td></tr></table>
      ${site ? `<p style="margin:0 0 6px;font-size:13.5px"><a href="${esc(site)}" style="color:#2F7FE0;font-weight:600">Δείτε την ιστοσελίδα σας ↗</a></p>` : ''}
      ${next ? `<div style="margin:18px 0 6px;padding:13px 16px;background:#FFF8E8;border-radius:12px;font-size:13.5px;color:#5C4A12"><b>Επόμενο βήμα:</b> ${esc(next)}</div>` : ''}
    </div>
    <div style="padding:16px 26px 24px;font-size:12.5px;color:#7A8394;border-top:1px solid #EEF0F4;margin-top:16px">Ο σύνδεσμος είναι προσωπικός και δεν χρειάζεται κωδικό. Αν προτιμάτε, απαντήστε απευθείας σε αυτό το e-mail.<br><b style="color:#10141F">Άγγελος · Advon Media</b> · <a href="${SITE_URL}" style="color:#7A8394">advonmedia.com</a></div>
  </div></div>`;
}
const clientTextFoot = (t) => `\n\n→ Απαντήστε στη συνομιλία μας: ${chatLink(t)}\n\nΣτάδιο: ${STAGE_EL[normStage(t.stage)]}${NEXT_STEP[normStage(t.stage)] ? '\nΕπόμενο βήμα: ' + NEXT_STEP[normStage(t.stage)] : ''}\n\nΆγγελος · Advon Media`;
const msgCard = (html, link) => `<div style="border-left:4px solid #2F7FE0;background:#F4F8FE;border-radius:0 14px 14px 0;padding:16px 18px;font-size:15px;color:#10141F">
      <div style="font:700 12px ${FONT};color:#2F7FE0;margin:0 0 8px">Άγγελος · Advon Media</div>${html}</div>`;

export function newMessageMail(t, text, files) {
  const link = chatLink(t);
  const body = text ? cut(text, 2400) : '';
  const fl = files && files.length ? `<p style="font-size:13px;color:#687182;margin:10px 0 0">📎 ${files.length === 1 ? '1 συνημμένο' : files.length + ' συνημμένα'}: ${esc(files.map((f) => f.name).join(', '))} — θα τα βρείτε στη συνομιλία.</p>` : '';
  const hi = `${greeting()} σας!`;
  return {
    subject: `Νέο μήνυμα για την ιστοσελίδα σας · Advon Media`,
    text: `${hi}\n\nΣας έγραψα στη σελίδα συνομιλίας μας:\n\n${plainText(body) || '(συνημμένο αρχείο)'}${clientTextFoot(t)}`,
    html: clientWrap(t, {
      preheader: cut(plainText(body) || 'Σας στείλαμε ένα αρχείο', 110),
      title: 'Έχετε νέο μήνυμα',
      bodyHtml: `<p style="margin:0 0 14px;font-size:15px">${hi} Σας έγραψα στη σελίδα συνομιλίας μας:</p>${msgCard(body ? richText(body, link) : '(συνημμένο αρχείο)', link)}${fl}`,
      cta: 'Απαντήστε στη συνομιλία',
    }),
  };
}
const REMIND = {
  yliko: ['Μια μικρή υπενθύμιση για την ιστοσελίδα σας', 'Για να ξεκινήσουμε την ιστοσελίδα σας χρειαζόμαστε μόνο λίγες φωτογραφίες (εσείς, ο χώρος σας, το λογότυπο αν υπάρχει) — τίποτα άλλο δεν είναι υποχρεωτικό. Στείλτε τις στη σελίδα συνομιλίας μας και πατήστε «Ξεκινήστε την ιστοσελίδα μου». Σε 5–10 ημέρες θα έχετε το πρώτο draft.'],
  draft: ['Είδατε το πρώτο draft;', 'Το πρώτο draft της ιστοσελίδας σας σας περιμένει. Δείτε το με την ησυχία σας: αν θέλετε αλλαγές, γράψτε μου τις στη συνομιλία (1., 2., 3.) και πατήστε «Έστειλα όλες τις αλλαγές» — όσες χρειαστούν. Αν είναι ήδη όπως τη θέλετε, πατήστε «Όλα καλά — πάμε live» και γράψτε μου το domain που θα θέλατε.'],
  changes: ['Είναι όλα όπως τα θέλετε;', 'Οι αλλαγές σας είναι έτοιμες στη σελίδα σας. Αν είναι όλα εντάξει, πατήστε «Όλα καλά — πάμε live» στη συνομιλία και γράψτε μου το domain που θα θέλατε — τη δημοσιεύουμε σε 1–2 ημέρες. Αλλιώς γράψτε μου τι άλλο να αλλάξω και πατήστε «Έστειλα όλες τις αλλαγές».'],
};
export function reminderMail(t) {
  const r = REMIND[normStage(t.stage)]; if (!r) return null;
  const hi = `${greeting()} σας!`;
  return {
    subject: `${r[0]} · Advon Media`,
    text: `${hi}\n\n${r[1]}${clientTextFoot(t)}`,
    html: clientWrap(t, { preheader: r[1].slice(0, 110), title: r[0], bodyHtml: `<p style="margin:0 0 6px;font-size:15px">${hi}</p><p style="margin:0;font-size:15px">${esc(r[1])}</p>`, cta: 'Ανοίξτε τη συνομιλία' }),
  };
}
// a one-off note queued by the agent for one client (outbox kind 'client') — same layout as every other client e-mail
export function plainClientMail(t, subject, text) {
  const link = chatLink(t);
  return { subject: subject || 'Μήνυμα από την Advon Media', text: `${plainText(text)}${clientTextFoot(t)}`, html: clientWrap(t, { preheader: cut(plainText(text), 110), title: subject || 'Μήνυμα για την ιστοσελίδα σας', bodyHtml: msgCard(richText(text, link), link), cta: 'Ανοίξτε τη συνομιλία' }) };
}

// ---------- the layout of everything that goes to Angelo ----------
// blocks: [{ h:'1 · What the client asked', quote:'…' | lines:[…] | text:'…', tone:'blue|green|amber|grey' }]
function angeloMail({ badge, badgeColor, name, stage, sub, blocks, foot, t }) {
  const tone = { blue: ['#F4F8FE', '#2F7FE0'], green: ['#EFFAF4', '#0B9E5C'], amber: ['#FFF8E8', '#B7791F'], grey: ['#F5F6F8', '#8A93A3'] };
  const bl = blocks.filter(Boolean).map((b) => {
    const [bg, bar] = tone[b.tone || 'grey'];
    const inner = b.lines ? `<ul style="margin:0;padding:0 0 0 18px">${b.lines.map((l) => `<li style="margin:0 0 6px">${esc(l)}</li>`).join('')}</ul>` : esc(b.quote ?? b.text ?? '').replace(/\r?\n/g, '<br>');
    return `<p style="margin:22px 0 8px;font:800 12px ${FONT};letter-spacing:.1em;text-transform:uppercase;color:#10141F">${esc(b.h)}</p>
      <div style="background:${bg};border-left:4px solid ${bar};border-radius:0 12px 12px 0;padding:14px 16px;font-size:14.5px;color:#10141F">${inner}</div>${b.note ? `<p style="margin:6px 0 0;font-size:12.5px;color:#7A8394">${esc(b.note)}</p>` : ''}`;
  }).join('');
  return `<div style="background:#F3F5F9;padding:24px 12px"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #E6E9F0;font-family:${FONT};color:#10141F;line-height:1.55">
    <div style="background:#0B0E12;padding:16px 26px"><span style="font:800 12px ${FONT};letter-spacing:.18em;text-transform:uppercase;color:#fff">Advon CRM · Chats</span></div>
    <div style="padding:24px 26px 26px">
      <span style="display:inline-block;background:${badgeColor};color:#fff;font:800 11px ${FONT};letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:6px 12px">${esc(badge)}</span>
      <h1 style="font:800 24px ${FONT};margin:12px 0 4px">${esc(name)}</h1>
      <p style="margin:0;font-size:14px;color:#5C6575">${stage ? `Stage: <b style="color:#10141F">${esc(stage)}</b>` : ''}${stage && sub ? ' · ' : ''}${esc(sub || '')}</p>
      ${bl}
      ${t ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 0"><tr><td style="background:#2F7FE0;border-radius:12px"><a href="${crmLink(t)}" style="display:inline-block;padding:13px 24px;font:700 15px ${FONT};color:#fff;text-decoration:none">Open this chat in the CRM →</a></td></tr></table>` : ''}
      ${foot ? `<p style="margin:18px 0 0;font-size:12.5px;color:#7A8394">${esc(foot)}</p>` : ''}
    </div></div></div>`;
}
const tgBlock = (h, body) => `\n\n<b>${tgEsc(h)}</b>\n${body}`;
const tgQuote = (s, n = 700) => `<blockquote>${tgEsc(cut(s, n))}</blockquote>`;
const tgList = (lines) => lines.map((l) => '• ' + tgEsc(l)).join('\n');
const textBlocks = (blocks) => blocks.filter(Boolean).map((b) => `\n\n${b.h.toUpperCase()}\n${b.lines ? b.lines.map((l) => '• ' + l).join('\n') : (b.quote ?? b.text ?? '')}${b.note ? '\n(' + b.note + ')' : ''}`).join('');

// 1 · a client wrote
export function clientWroteNote(t, fresh) {
  const msgs = (fresh || []).filter((m) => !m.deleted);
  const n = msgs.length || t.unreadAdmin || 1;
  const files = msgs.flatMap((m) => m.files || []);
  const said = msgs.map((m) => m.text).filter(Boolean).join('\n\n') || t.lastText || '(files only)';
  const sub = `${n === 1 ? '1 new message' : n + ' new messages'}${files.length ? ` · 📎 ${files.length} file${files.length === 1 ? '' : 's'}` : ''}${t.pin ? ' · ★ priority' : ''}`;
  // one of the three big buttons on the client page? (message.kind = 'ready:build' | 'ready:changes' | 'ready:live')
  const pressed = (msgs.map((m) => m.kind).find((k) => k && k.startsWith('ready:')) || (t.ready && t.ready.at && msgs.some((m) => m.id === t.ready.id) ? 'ready:' + t.ready.kind : '') || '').slice(6);
  const BTN = {
    build: ['✅ READY TO BUILD', 'The client pressed «Ξεκινήστε την ιστοσελίδα μου» — everything they have is in the chat. Claude builds the first draft at the next check (09:05 / 17:05) and sends you the first-draft message to approve.'],
    changes: ['✏️ READY FOR CHANGES', 'The client pressed «Έστειλα όλες τις αλλαγές». Claude does every change on the draft at the next check and sends you the «changes done» reply to approve.'],
    live: ['🚀 WANTS TO GO LIVE', 'The client pressed «Όλα καλά — πάμε live» and wrote the domain they want. Check it, buy it at Papaki, connect it — then press «Domain connected» in the chat: the review message goes out by itself.'],
  };
  const b = BTN[pressed];
  const next = b ? b[1] : 'Nothing is needed right now. Claude reads it at the next check (09:05 and 17:05), does the work on the draft and sends you the reply to approve. You can also answer yourself at any time.';
  const blocks = [
    { h: 'What they wrote', quote: cut(said, 1800), tone: 'blue' },
    files.length ? { h: 'Files', lines: files.map((f) => f.name), tone: 'grey' } : null,
    { h: 'What happens next', text: next, tone: b ? 'green' : 'grey' },
  ];
  return {
    tg: `${b ? b[0] + ' — ' : '💬 '}<b>${tgEsc(upper(t.name))}</b>${b ? '' : ' wrote'}\nStage: <b>${tgEsc(stageEn(t.stage))}</b> · ${tgEsc(sub)}${tgBlock('What they wrote', tgQuote(said))}${files.length ? tgBlock('Files', tgList(files.slice(0, 8).map((f) => f.name))) : ''}${tgBlock('What happens next', tgEsc(b ? b[1] : 'Claude prepares the reply at the next check (09:05 / 17:05) and asks for your OK — or answer now yourself.'))}`,
    buttons: [{ text: 'Open the chat', url: crmLink(t) }],
    subject: `${b ? b[0] : '💬'} ${t.name}${b ? '' : ' wrote'} · ${stageEn(t.stage)}`,
    text: `${t.name} ${b ? b[0] : 'wrote'} — stage ${stageEn(t.stage)} · ${sub}${textBlocks(blocks)}\n\nOpen the chat: ${crmLink(t)}`,
    html: angeloMail({ badge: b ? b[0].replace(/^\S+\s/, '') : 'New message', badgeColor: b ? '#0B9E5C' : '#2F7FE0', name: t.name, stage: stageEn(t.stage), sub, blocks, t }),
  };
}
// 2 · Claude prepared a reply and needs Angelo's OK (t.suggest)
export function approvalNote(t, askedFallback) {
  const s = t.suggest || {};
  const asked = s.asked || askedFallback || '';
  const steps = (Array.isArray(s.steps) ? s.steps : []).filter(Boolean);
  const doneLines = steps.length ? steps : (s.plan ? [s.plan] : []);
  const intend = s.mode === 'intend';
  const hWork = intend ? '2 · What I intend to do' : '2 · What I did (on the draft only)';
  const noteWork = intend ? 'Nothing has been touched yet — I start when you say OK.' : 'Saved to the DRAFT only. Nothing is published and the client has not been told.';
  const stageLine = s.stage && normStage(s.stage) !== normStage(t.stage) ? `${stageEn(t.stage)} → ${stageEn(s.stage)} when you send it` : stageEn(t.stage);
  const blocks = [
    asked ? { h: '1 · What the client asked', quote: cut(asked, 1500), tone: 'blue' } : null,
    doneLines.length ? { h: hWork, lines: doneLines, tone: 'green', note: noteWork } : null,
    s.draft ? { h: 'Check it here', text: s.draft, tone: 'grey' } : null,
    s.text ? { h: '3 · The reply I will send to the client', quote: plainText(cut(s.text, 2200)), tone: 'amber', note: 'Not sent yet.' } : null,
    s.unclear ? { h: 'Not sure about', text: s.unclear, tone: 'grey' } : null,
    { h: 'What you do', lines: ['Open the chat in the CRM', '«Send it» = the reply goes out exactly as above', '«Edit first» = change the wording, then send', '«Dismiss» = nothing is sent'], tone: 'grey' },
  ];
  let tg = `✋ <b>APPROVAL NEEDED — ${tgEsc(upper(t.name))}</b>\nStage: <b>${tgEsc(stageLine)}</b>${t.email ? '' : ' · ⚠ no e-mail on the card'}`;
  if (asked) tg += tgBlock('1 · What the client asked', tgQuote(asked, 500));
  if (doneLines.length) tg += tgBlock(hWork, tgList(doneLines.map((l) => cut(l, 300))) + `\n<i>${tgEsc(noteWork)}</i>`);
  if (s.draft) tg += tgBlock('Check it here', tgEsc(s.draft));
  if (s.text) tg += tgBlock('3 · The reply I will send', tgQuote(plainText(s.text), 900));
  if (s.unclear) tg += tgBlock('Not sure about', tgEsc(cut(s.unclear, 400)));
  tg += `\n\n👉 <b>Nothing has been sent.</b> Open the chat → Send it · Edit first · Dismiss`;
  return {
    tg, buttons: [{ text: 'Open & approve', url: crmLink(t) }],
    subject: `✋ Approval needed — ${t.name} · ${stageEn(t.stage)}`,
    text: `APPROVAL NEEDED — ${t.name}\nStage: ${stageLine}${textBlocks(blocks)}\n\nOpen the chat: ${crmLink(t)}`,
    html: angeloMail({ badge: 'Approval needed', badgeColor: '#E8590C', name: t.name, stage: stageLine, sub: t.email ? '' : '⚠ no e-mail on the card — the client will not be told about the answer', blocks, t, foot: 'Nothing has been sent to the client. The reply waits in the CRM until you press «Send it».' }),
  };
}
// 3 · a client went quiet and has no e-mail, so no reminder can reach them
export function quietNote(t, days) {
  const opened = !!t.clientSeenAt;
  const blocks = [
    { h: 'What is going on', lines: [`No word for ${days} days — we wrote last.`, 'There is no e-mail on the card, so no reminder can reach them.', opened ? 'They have opened the link before.' : 'They have NOT opened their link even once.'], tone: 'amber' },
    { h: 'What you do', lines: ['Send them a Viber with their link (below)', 'Or add their e-mail to the chat card — then reminders go out by themselves'], tone: 'grey' },
    { h: 'Their link', text: chatLink(t), tone: 'grey' },
  ];
  return {
    tg: `🔕 <b>${tgEsc(upper(t.name))}</b> — quiet for ${days} days\nStage: <b>${tgEsc(stageEn(t.stage))}</b> · no e-mail → no reminders${opened ? '' : ' · link never opened'}${tgBlock('What you do', tgList(['Viber them their link:', chatLink(t)]))}`,
    buttons: [{ text: 'Open the chat', url: crmLink(t) }],
    subject: `🔕 ${t.name} — quiet ${days} days, no e-mail`,
    text: `${t.name} — quiet for ${days} days (stage ${stageEn(t.stage)})${textBlocks(blocks)}`,
    html: angeloMail({ badge: 'Quiet client', badgeColor: '#8A93A3', name: t.name, stage: stageEn(t.stage), sub: `quiet for ${days} days`, blocks, t }),
  };
}
// 4 · a reminder e-mail went to a client — short, Telegram only
export const reminderSentNote = (t, n) => ({ tg: `🔔 <b>${tgEsc(upper(t.name))}</b> — reminder #${n} e-mailed\nStage: <b>${tgEsc(stageEn(t.stage))}</b> · quiet since ${tgEsc(String(t.lastAt).slice(0, 10))}${n >= 2 ? '\n<i>That was the last automatic reminder — a call or a Viber is next.</i>' : ''}`, buttons: [{ text: 'Open the chat', url: crmLink(t) }] });
// 5 · a report from the chat agent (outbox kind 'angelo'): {title, items:[{client, slug, lines:[…]}], text}
export function agentNote(o, idx) {
  const title = o.title || o.subject || 'Chat agent report';
  const items = Array.isArray(o.items) ? o.items.filter((x) => x && (x.client || x.lines)) : [];
  const find = (it) => (idx || []).find((x) => x.slug === it.slug) || null;
  const blocks = items.map((it) => ({ h: it.client || 'Note', lines: (it.lines || []).map(String), tone: 'blue' }));
  if (o.text) blocks.push({ h: items.length ? 'Notes' : 'Report', text: String(o.text), tone: 'grey' });
  let tg = `🤖 <b>${tgEsc(upper(title))}</b>`;
  items.forEach((it) => { const t = find(it); tg += `\n\n👤 <b>${tgEsc(upper(it.client))}</b>${t ? ` · ${tgEsc(stageEn(t.stage))}` : ''}\n${tgList((it.lines || []).map((l) => cut(l, 300)))}`; });
  if (o.text) tg += `\n\n${tgEsc(cut(o.text, 1500))}`;
  const one = items.length === 1 ? find(items[0]) : null;
  return {
    tg, buttons: [{ text: one ? 'Open the chat' : 'Open Chats', url: crmLink(one) }],
    subject: `🤖 ${items.length === 1 && items[0].client ? items[0].client + ' — ' : ''}${title}`,
    text: `${title}${textBlocks(blocks)}\n\n${crmLink(one)}`,
    html: angeloMail({ badge: 'Chat agent', badgeColor: '#6D4AE8', name: items.length === 1 && items[0].client ? items[0].client : title, stage: '', sub: items.length === 1 ? title : `${items.length || ''} ${items.length ? 'client' + (items.length === 1 ? '' : 's') : ''}`.trim(), blocks, t: one || { slug: '' } }),
  };
}
