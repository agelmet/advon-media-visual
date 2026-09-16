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
// The current head (memoised for 1.5 s so a burst of polls is one call).
export async function currentHead(conf, force = false) {
  if (!force && C.head && Date.now() - C.at < 1500) return C.head;
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
    return { ok: r.ok, why: r.ok ? '' : `resend ${r.status}` };
  } catch (e) { return { ok: false, why: e.message }; }
}
export async function sendTelegram(mc, text) {
  if (!mc.tgToken || !mc.tgChat) return { ok: false, why: 'no telegram' };
  try {
    const r = await fetch(`https://api.telegram.org/bot${mc.tgToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: mc.tgChat, text, disable_web_page_preview: true }) });
    return { ok: r.ok, why: r.ok ? '' : `telegram ${r.status}` };
  } catch (e) { return { ok: false, why: e.message }; }
}

// ---------- templates (Greek, Angelo's voice — warm, short, no pressure) ----------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
export const chatLink = (t) => `${SITE_URL}/c/${t.code}`;
function wrap(title, bodyHtml, link, cta) {
  return `<div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 22px;color:#10141F;line-height:1.55">
    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#2F7FE0;font-weight:700;margin:0 0 14px">Advon Media</p>
    <h2 style="font-size:20px;margin:0 0 14px;font-weight:800">${esc(title)}</h2>
    ${bodyHtml}
    <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#2F7FE0;color:#fff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">${esc(cta)}</a></p>
    <p style="font-size:12.5px;color:#687182">Ο σύνδεσμος είναι προσωπικός — δεν χρειάζεται κωδικός. Αν προτιμάτε, απαντήστε απευθείας σε αυτό το e-mail.<br>Άγγελος · Advon Media · advonmedia.com</p>
  </div>`;
}
export function newMessageMail(t, text, files) {
  const link = chatLink(t);
  const preview = text ? text.slice(0, 900) : '';
  const fl = files && files.length ? `<p style="font-size:13px;color:#687182">📎 ${esc(files.map((f) => f.name).join(', '))}</p>` : '';
  const body = `<p style="margin:0 0 12px">Καλησπέρα! Σας έγραψα στη σελίδα συνομιλίας μας για την ιστοσελίδα σας:</p>
    <div style="background:#F1F5FB;border-radius:14px;padding:16px 18px;font-size:15px;white-space:pre-wrap">${esc(preview) || '(συνημμένο αρχείο)'}</div>${fl}`;
  return {
    subject: 'Νέο μήνυμα από τον Άγγελο (Advon Media)',
    text: `Καλησπέρα! Σας έγραψα στη σελίδα συνομιλίας μας για την ιστοσελίδα σας:\n\n${preview || '(συνημμένο αρχείο)'}\n\nΑνοίξτε τη συνομιλία: ${link}\n\nΆγγελος · Advon Media`,
    html: wrap('Νέο μήνυμα για την ιστοσελίδα σας', body, link, 'Ανοίξτε τη συνομιλία'),
  };
}
const REMIND = {
  yliko: ['Μια μικρή υπενθύμιση για το υλικό σας', 'Καλησπέρα! Μια φιλική υπενθύμιση: για να ξεκινήσουμε την ιστοσελίδα σας χρειαζόμαστε λίγο υλικό — φωτογραφίες, το λογότυπο (αν υπάρχει) και δυο λόγια για εσάς. Στείλτε τα από τη σελίδα συνομιλίας μας όποτε σας βολεύει, κι εμείς ξεκινάμε αμέσως.'],
  draft: ['Είδατε το πρώτο draft;', 'Καλησπέρα! Το πρώτο draft της ιστοσελίδας σας σας περιμένει. Δείτε το με την ησυχία σας και γράψτε μου στη συνομιλία ό,τι θέλετε να αλλάξουμε — όσες αλλαγές χρειαστούν μέχρι να είναι ακριβώς όπως τη θέλετε. Μόλις το εγκρίνετε, προχωράμε στη δημοσίευση.'],
  changes: ['Είναι όλα όπως τα θέλετε;', 'Καλησπέρα! Οι τελευταίες αλλαγές είναι έτοιμες στη σελίδα σας. Αν είναι όλα όπως τα θέλετε, γράψτε μου «προχωράμε» στη συνομιλία και τη δημοσιεύουμε — αλλιώς πείτε μου τι άλλο να αλλάξω.'],
};
export function reminderMail(t) {
  const r = REMIND[t.stage]; if (!r) return null;
  const link = chatLink(t);
  return { subject: r[0] + ' · Advon Media', text: `${r[1]}\n\nΗ συνομιλία μας: ${link}\n\nΆγγελος · Advon Media`, html: wrap(r[0], `<p style="margin:0 0 12px">${esc(r[1])}</p>`, link, 'Ανοίξτε τη συνομιλία') };
}
