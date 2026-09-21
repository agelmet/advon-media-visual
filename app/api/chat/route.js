// app/api/chat/route.js — Advon Chats (16 Sept 2026)
//
// One private conversation per client, lived in the PRIVATE data repo (CRM_GH_REPO):
//   chats/index.json                 → every thread's card: name, contact, stage, last message, unread counters
//   chats/<slug>/messages.json       → the messages of one thread (oldest first)
//   chats/<slug>/files/<id>-<name>   → attachments (images, PDFs, docs)
//
// Who talks to it:
//   • the CLIENT page advonmedia.com/c/<code>  — identified only by the secret code in the link
//       GET  /api/chat?c=<code>[&h=<head>]        → {name, stage, site, messages, adminSeenAt, head}; «same:true» when nothing changed
//       POST /api/chat?c=<code>                   JSON {text, files:[{sha,name,bytes,type,w,h}], kind?} → append a client message
//                                                  (kind 'build' | 'changes' | 'live' = one of the big buttons → card.ready = {kind, at})
//       POST /api/chat?c=<code>&file=1            multipart {file} → loose blob (no commit) → {sha}
//       POST /api/chat?c=<code>&seen=1            → the client has read everything (clears their unread counter)
//       GET  /api/chat?c=<code>&file=<path>       → one attachment of THAT thread
//   • the CRM «Chats» tab (x-crm-auth, the same sync token as every other CRM route)
//       GET  /api/chat?list=1[&h=<head>]          → {threads:[…], notify:{email,telegram}, head}
//       GET  /api/chat?t=<slug>[&h=<head>]        → {thread, messages, head}
//       POST /api/chat?t=<slug>                   JSON {text, files} → append an Advon message (+ e-mail to the client)
//       POST /api/chat?t=<slug>&seen=1            → Angelo has read the thread
//       POST /api/chat?t=<slug>&meta=1            JSON {name,email,phone,site,stage,archived,pin,unread,dat,form,ready:null} → edit the card
//                                                  (pin:true = «Priority», kept on top of the list; unread:true = mark as unread again)
//       POST /api/chat?order=1                    JSON {slugs:[…]} → the Priority chats in the order Angelo dragged them (ord = position)
//       POST /api/chat?t=<slug>&remove=1          → DELETE the chat for good: card, messages and files leave the repo in one commit and
//                                                  the client's link stops working. A line stays in chats/deleted.json (name, when, the
//                                                  commit just before) so it can still be brought back from the repo's history.
//       POST /api/chat?new=1                      JSON {name,email,phone,site,stage,welcome} → create a thread + link
//       POST /api/chat?t=<slug>&file=1            multipart {file} → loose blob
//       GET  /api/chat?file=<path>                → any attachment
//   • the chat AGENT (Claude, scheduled task) — ?k=<key>   (from the Mac only api.github.com is reachable, so the
//     agent normally uses ADVON-CLIENTS/.advon/chat.py, which writes the same files straight into the data repo)
//       GET  /api/chat?k=<read key>[&t=<slug>][&format=json]   → plain-text digest of what waits for an answer, or one thread
//       POST /api/chat?k=<agent key>&t=<slug>     JSON {text} → append a message as «claude» (shown to the client as Advon Media,
//                                                  tagged «Claude» in the CRM so Angelo always sees which replies were automated)
//
// Every write is ONE commit through lib/ghdata.js (retried on ref races). Reads go through lib/chatcore.js: one
// recursive listing of chats/ per branch head + blobs cached by sha, so a poll that finds nothing new is ONE GitHub
// call and opening a thread is at most one blob fetch. Notifications (e-mail to clients, Telegram to Angelo,
// reminders) are sent by netlify/functions/chat-notify.mjs every 5 minutes from the same files.

import { ghReady, ghConf, commit as ghCommit, createBlob } from '@/lib/ghdata';
import { DIR, INDEX_PATH, SITE_URL, STAGES, normStage, currentHead, forgetHead, getIndex as coreIndex, getMessages as coreMessages, readChatBuffer, headNow, mailConf, sendTelegram, telegramDiag, sendEmail, clientWroteNote, approvalNote, agentNote, newMessageMail, reminderMail } from '@/lib/chatcore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE = 4.5 * 1024 * 1024;
const MAX_FILES = 12;
const MAX_TEXT = 4000;
const SLUG_RE = /^[a-z0-9-]{2,50}$/;
const CODE_RE = /^[a-z0-9-]{8,70}$/;
const SHA_RE = /^[0-9a-f]{40}$/;
const NAME_OK = /\.(jpe?g|png|webp|gif|bmp|tiff?|heic|heif|svg|pdf|docx?|xlsx?|pptx?|txt|rtf|csv|zip|mp4|mov|m4a|mp3|ogg|webm)$/i;

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Content-Type': 'application/json; charset=utf-8',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: NO_STORE });

function cfg() {
  return {
    ...ghConf(),
    authHash: process.env.CRM_AUTH_HASH,
  };
}

// ---------- small helpers ----------
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const safeName = (n) => clean(n, 120).replace(/[^\w.\-\u0370-\u03FF\u1F00-\u1FFF ]+/g, '_').replace(/\s+/g, '_') || 'file';
const nowIso = () => new Date().toISOString();
const rnd = (n) => { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; let s = ''; const b = crypto.getRandomValues(new Uint8Array(n)); for (let i = 0; i < n; i++) s += a[b[i] % a.length]; return s; };
const msgId = () => Date.now().toString(36) + rnd(4);
function slugify(s) {
  const map = { α: 'a', ά: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z', η: 'i', ή: 'i', θ: 'th', ι: 'i', ί: 'i', ϊ: 'i', ΐ: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'o' };
  return String(s || '').toLowerCase().split('').map((ch) => map[ch] ?? ch).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32) || 'client';
}
const hits = new Map();
function limited(req, key, max, windowMs) {
  const ip = (req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || 'x').split(',')[0].trim();
  const k = `${key}:${ip}`; const now = Date.now();
  const arr = (hits.get(k) || []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(k, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}
async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
async function crmAuthorized(req, c) {
  const t = req.headers.get('x-crm-auth') || '';
  if (!t || !c.authHash) return false;
  return safeEqual(await sha256Hex(t), String(c.authHash).trim().toLowerCase());
}
// Agent keys (values live only in ADVON-CLIENTS/.advon/secrets.env — BRIEF_READ_KEY and CHAT_AGENT_KEY)
const READ_KEY_SHA256 = '78085eb3d9b816c080a3cbeee27e1b67cd5775b568083951a66ef6f5c1aa65d6';
const AGENT_KEY_SHA256 = '9bdf28e5bfba580df30a7b218900fa53dc3fba6e8a1317df8e8c2326080ac38a';
async function keyLevel(k) {
  if (!k) return 0;
  const h = await sha256Hex(k);
  if (h === AGENT_KEY_SHA256) return 2;
  if (h === READ_KEY_SHA256) return 1;
  return 0;
}
const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp', tif: 'image/tiff', tiff: 'image/tiff', svg: 'image/svg+xml', heic: 'image/heic', heif: 'image/heif', pdf: 'application/pdf', txt: 'text/plain; charset=utf-8', rtf: 'application/rtf', csv: 'text/csv; charset=utf-8', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', zip: 'application/zip', mp4: 'video/mp4', mov: 'video/quicktime', m4a: 'audio/mp4', mp3: 'audio/mpeg', ogg: 'audio/ogg', webm: 'video/webm' };

// ---------- reads (cached in lib/chatcore.js — one GitHub call when nothing changed) ----------
const online = new Map();            // slug → last time the client page polled (memory only)
const getIndex = (c) => coreIndex(c);
const getMessages = (c, slug) => coreMessages(c, slug);
const current = (c) => currentHead(c);
// what the client page may see of a card — plus `dat` (Angelo ticked «has a doctoranytime profile», so the page asks only for
// photos) and `ready` ({kind:'build'|'changes'|'live', at} — the button the client pressed last, cleared when the stage moves on)
const publicThread = (t) => ({ slug: t.slug, name: t.name, stage: normStage(t.stage), site: t.site || '', adminSeenAt: t.adminSeenAt || null, createdAt: t.createdAt, log: (t.log || []).slice(-3), dat: !!t.dat, form: !!t.form, ready: t.ready || null });
const READY_KINDS = ['build', 'changes', 'live'];

// ---------- the write: append a message ----------
async function appendMessage(c, slug, msg, blobFiles = [], opts = {}) {
  let thread = null, dup = null;
  await ghCommit(c, `chat: ${slug} ← ${msg.from}`, async (ctx) => {
    const { data: idx } = await ctx.readJson(INDEX_PATH, []);
    const list = Array.isArray(idx) ? idx : [];
    const t = list.find((x) => x.slug === slug);
    if (!t) throw Object.assign(new Error('no thread'), { code: 'no_thread' });
    const { data: msgs } = await ctx.readJson(`${DIR}/${slug}/messages.json`, []);
    const arr = Array.isArray(msgs) ? msgs : [];
    // the same message sent twice (a retry after a lost answer, a double tap) is stored once
    if (msg.cid) { const twin = arr.slice(-40).find((x) => x.cid === msg.cid && x.from === msg.from); if (twin) { dup = twin; thread = t; return null; } }
    arr.push(msg);
    if (msg.from !== 'client' && t.suggest) delete t.suggest;      // an answer went out — Claude's suggestion is history
    // the client pressed one of the big buttons («ξεκινήστε» / «έστειλα όλες τις αλλαγές» / «πάμε live») — the card remembers it
    // until the stage moves on or we answer with clearReady, so the agent knows exactly when to build / change / publish
    if (msg.from === 'client' && msg.kind && msg.kind.startsWith('ready:')) t.ready = { kind: msg.kind.slice(6), at: msg.at, id: msg.id };
    if (msg.from !== 'client' && opts.clearReady) delete t.ready;
    t.lastAt = msg.at; t.lastFrom = msg.from; t.lastText = (msg.text || (msg.files && msg.files.length ? '📎 ' + msg.files.map((f) => f.name).join(', ') : '')).slice(0, 140); t.n = arr.length;
    if (msg.from === 'client') { t.unreadAdmin = (t.unreadAdmin || 0) + 1; t.clientSeenAt = msg.at; t.unreadClient = 0; t.remindersSent = 0; t.lastReminderAt = null; }
    else { t.unreadClient = (t.unreadClient || 0) + 1; t.adminSeenAt = msg.at; t.unreadAdmin = 0; if (msg.from === 'claude') t.lastClaudeAt = msg.at; }
    thread = t;
    return [
      { path: `${DIR}/${slug}/messages.json`, content: JSON.stringify(arr, null, 1) },
      ...blobFiles.map((f) => ({ path: f.path, blobSha: f.sha })),
      { path: INDEX_PATH, content: JSON.stringify(list, null, 1) },
    ];
  });
  if (dup) return { thread, dup };
  forgetHead();
  return { thread, dup: null };
}
function normFiles(slug, id, files) {
  return (Array.isArray(files) ? files : []).slice(0, MAX_FILES)
    .map((f, i) => ({ sha: String(f.sha || ''), name: safeName(f.name), bytes: Math.max(0, +f.bytes || 0), type: clean(f.type, 60), w: +f.w || 0, h: +f.h || 0 }))
    .filter((f) => SHA_RE.test(f.sha) && NAME_OK.test(f.name))
    .map((f, i) => ({ ...f, path: `${DIR}/${slug}/files/${id}-${String(i + 1).padStart(2, '0')}-${f.name}` }));
}
const stripSha = (files) => files.map(({ sha, ...rest }) => rest);

async function fileResponse(c, path) {
  const buf = await readChatBuffer(c, path.replace(/^chats\//, ''));
  if (!buf) return json({ error: 'not found' }, 404);
  const ext = (path.split('.').pop() || '').toLowerCase();
  const fname = encodeURIComponent(path.split('/').pop());
  return new Response(buf, { status: 200, headers: { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'private, max-age=31536000, immutable', 'Content-Disposition': `inline; filename*=UTF-8''${fname}` } });
}

// =====================================================================
export async function GET(req) {
  const c = cfg();
  if (!ghReady(c)) return json({ error: 'storage not configured' }, 503);
  const url = new URL(req.url);
  const q = (k) => url.searchParams.get(k);

  try {
    // ---- client page ----
    if (q('c')) {
      const code = String(q('c')).toLowerCase();
      if (!CODE_RE.test(code)) return json({ error: 'bad link' }, 400);
      if (limited(req, 'cget', 1500, 60 * 60 * 1000)) return json({ error: 'slow down' }, 429);
      const idx = await getIndex(c);
      const t = idx.find((x) => x.code === code && !x.archived);
      if (!t) return json({ error: 'unknown link' }, 404);
      online.set(t.slug, Date.now());
      if (q('file')) {
        const path = String(q('file'));
        if (!path.startsWith(`${DIR}/${t.slug}/files/`) || path.includes('..') || !/^[\w./\-\u0370-\u03FF\u1F00-\u1FFF]+$/.test(path)) return json({ error: 'bad path' }, 400);
        return fileResponse(c, path);
      }
      if (q('h') && q('h') === headNow()) return json({ ok: true, same: true, head: headNow() });
      const messages = await getMessages(c, t.slug);
      return json({ ok: true, thread: publicThread(t), messages: messages.map((m) => ({ id: m.id, from: m.from === 'client' ? 'client' : 'advon', text: m.text, files: m.files || [], at: m.at, ...(m.kind ? { kind: m.kind } : {}), ...(m.deleted ? { deleted: true } : {}) })), head: headNow() });
    }

    // ---- agents ----
    if (q('k')) {
      if (limited(req, 'agent', 600, 60 * 60 * 1000)) return new Response('slow down', { status: 429 });
      const lvl = await keyLevel(q('k'));
      if (!lvl) return new Response('forbidden', { status: 403 });
      // agent key only: ?test=telegram | ?test=email → send one test now and report what the provider said
      if (lvl === 2 && q('test') === 'telegram') { const mc = mailConf(); const diag = await telegramDiag(mc); const send = await sendTelegram(mc, '✅ Advon Alerts: οι ειδοποιήσεις Telegram δουλεύουν.'); return json({ diag, send }); }
      if (lvl === 2 && q('test') === 'email') { const mc = mailConf(); const to = q('to') || mc.notifyTo; const send = await sendEmail(mc, to, '✅ Advon Media — δοκιμή e-mail', 'Οι ειδοποιήσεις e-mail από το advonmedia.com δουλεύουν.'); return json({ from: mc.from, to, send }); }
      // agent key only: ?test=samples → ONE sample of every message Angelo gets (Telegram + e-mail) and of the client e-mail
      // (sent to Angelo's own address), all built from a made-up client called «ΔΟΚΙΜΗ», so the wording and layout can be checked for real.
      if (lvl === 2 && q('test') === 'samples') {
        const mc = mailConf();
        const t = { slug: 'dokimi', code: 'dokimi-sample00', name: 'Δοκιμή Πελάτης (sample)', stage: 'changes', email: mc.notifyTo, site: 'https://advonmedia.com', lastAt: new Date().toISOString(), unreadAdmin: 2, clientSeenAt: '',
          suggest: { at: new Date().toISOString(), stage: 'changes', draft: 'https://agelmet.github.io/DOKIMI', asked: 'Καλησπέρα! Θα ήθελα να αλλάξουμε τη φωτογραφία στην αρχή με αυτή που σας στέλνω, και το τηλέφωνο είναι λάθος — το σωστό είναι 697 000 0000.', steps: ['Hero photo replaced with the new one (whole photo, not cropped)', 'Phone corrected in the header, the contact section and the footer', 'Saved to the draft only'], text: 'Καλησπέρα σας!\n\nΟι αλλαγές έγιναν — ρίξτε μια ματιά: https://agelmet.github.io/DOKIMI\n\n1. Η φωτογραφία στην αρχή άλλαξε με τη νέα\n2. Το τηλέφωνο διορθώθηκε παντού\n\nΠείτε μου αν είναι όλα εντάξει τώρα.' } };
        const fresh = [{ from: 'client', text: t.suggest.asked, files: [{ name: 'nea-fotografia.jpg' }] }];
        const out = {};
        for (const [k, n] of [['wrote', clientWroteNote(t, fresh)], ['approval', approvalNote(t)], ['agent', agentNote({ title: 'Morning check (sample)', items: [{ client: t.name, slug: 'dokimi', lines: ['2 changes done on the draft', 'The reply waits for your OK in the CRM'] }], text: 'Nobody else wrote.' }, [t])]]) {
          const a = await sendTelegram(mc, n.tg, { html: true, buttons: n.buttons });
          const b = await sendEmail(mc, mc.notifyTo, '[SAMPLE] ' + n.subject, n.text, n.html);
          out[k] = { telegram: a.ok || a.why, email: b.ok || b.why };
        }
        const cm = newMessageMail(t, t.suggest.text, []);
        out.clientMail = (await sendEmail(mc, q('to') || mc.notifyTo, '[SAMPLE · what a client receives] ' + cm.subject, cm.text, cm.html));
        const rm = reminderMail({ ...t, stage: 'draft' });
        out.clientReminder = (await sendEmail(mc, q('to') || mc.notifyTo, '[SAMPLE · what a client receives] ' + rm.subject, rm.text, rm.html));
        return json(out);
      }
      const idx = (await getIndex(c)).filter((t) => !t.archived);
      if (q('t')) {
        const slug = String(q('t'));
        const t = idx.find((x) => x.slug === slug);
        if (!t) return new Response('no such thread', { status: 404 });
        const msgs = await getMessages(c, slug);
        if (q('format') === 'json') return json({ thread: t, messages: msgs });
        const L = [`THREAD ${t.slug} — ${t.name}${t.phone ? ' · ' + t.phone : ''}${t.email ? ' · ' + t.email : ''}${t.site ? ' · ' + t.site : ''} — stage ${t.stage}${t.dat ? ' — doctoranytime profile: yes' : ''}${t.ready ? ` — CLIENT PRESSED «${t.ready.kind}» at ${String(t.ready.at).slice(0, 16).replace('T', ' ')}` : ''} — link ${SITE_URL}/c/${t.code}`];
        msgs.forEach((m) => L.push(`[${String(m.at).slice(0, 16).replace('T', ' ')}] ${m.from === 'client' ? t.name : m.from === 'claude' ? 'Claude (as Advon)' : 'Angelo'}: ${m.kind ? '[BUTTON ' + m.kind + '] ' : ''}${(m.text || '').replace(/\s+/g, ' ')}${m.files && m.files.length ? '  📎 ' + m.files.map((f) => `${f.name} (${f.path})`).join(', ') : ''}`));
        return new Response(L.join('\n'), { headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      if (q('format') === 'json') return json({ threads: idx });
      const waiting = idx.filter((t) => t.lastFrom === 'client');
      const L = [`CHATS — ${waiting.length} conversation(s) waiting for an answer (${idx.length} active)`];
      waiting.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (a.ord ?? 1e9) - (b.ord ?? 1e9) || String(a.lastAt).localeCompare(String(b.lastAt)));
      const READY_EN = { build: 'READY TO BUILD (pressed «ξεκινήστε»)', changes: 'READY FOR CHANGES (pressed «έστειλα όλες τις αλλαγές»)', live: 'WANTS TO GO LIVE (pressed «πάμε live» — domain in the message)' };
      const flags = (t) => `${t.pin ? '★ PRIORITY ' : ''}${t.ready && READY_EN[t.ready.kind] ? '✅ ' + READY_EN[t.ready.kind] + ' ' : ''}${t.dat ? '[doctoranytime] ' : ''}${t.form ? '[has contact form] ' : ''}`;
      waiting.forEach((t) => L.push(`  • ${flags(t)}${t.name} (${t.slug}) — stage ${t.stage} — ${t.unreadAdmin || 0} unread — last ${String(t.lastAt).slice(0, 16).replace('T', ' ')}: «${(t.lastText || '').slice(0, 160)}»`));
      const readyQuiet = idx.filter((t) => t.ready && t.lastFrom !== 'client');
      if (readyQuiet.length) { L.push(`STILL FLAGGED — the client pressed a button and we have written since, but the work is not marked done (clearReady / the READY badge in the CRM):`); readyQuiet.forEach((t) => L.push(`  • ${flags(t)}${t.name} (${t.slug}) — stage ${t.stage}`)); }
      const quiet = idx.filter((t) => t.lastFrom !== 'client' && t.lastAt && Date.now() - Date.parse(t.lastAt) > 3 * 86400000);
      if (quiet.length) { L.push(`QUIET — we wrote last and heard nothing for 3+ days:`); quiet.forEach((t) => L.push(`  • ${t.name} (${t.slug}) — stage ${t.stage} — since ${String(t.lastAt).slice(0, 10)}`)); }
      return new Response(L.join('\n'), { headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    // ---- CRM ----
    if (!(await crmAuthorized(req, c))) return json({ error: 'unauthorized' }, 401);
    if (q('file')) {
      const path = String(q('file'));
      if (!path.startsWith(`${DIR}/`) || path.includes('..') || !/^[\w./\-\u0370-\u03FF\u1F00-\u1FFF]+$/.test(path)) return json({ error: 'bad path' }, 400);
      return fileResponse(c, path);
    }
    if (q('t')) {
      const slug = String(q('t'));
      if (!SLUG_RE.test(slug)) return json({ error: 'bad slug' }, 400);
      if (q('h') && q('h') === (await current(c))) return json({ ok: true, same: true, head: headNow() });
      const idx = await getIndex(c);
      const t = idx.find((x) => x.slug === slug);
      if (!t) return json({ error: 'not found' }, 404);
      const messages = await getMessages(c, slug);
      return json({ ok: true, thread: t, messages, head: headNow(), online: Date.now() - (online.get(slug) || 0) < 60 * 1000 });
    }
    if (q('h') && q('h') === (await current(c))) return json({ ok: true, same: true, head: headNow() });
    const idx = await getIndex(c);
    return json({ ok: true, threads: idx, head: headNow(), notify: { email: !!process.env.RESEND_API_KEY, telegram: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) }, onlineSlugs: [...online.entries()].filter(([, at]) => Date.now() - at < 60 * 1000).map(([s]) => s) });
  } catch (e) {
    return json({ error: e.message || 'read failed' }, 502);
  }
}

// =====================================================================
export async function POST(req) {
  const c = cfg();
  if (!ghReady(c)) return json({ error: 'storage not configured' }, 503);
  const url = new URL(req.url);
  const q = (k) => url.searchParams.get(k);

  // ---- who is writing? ----
  let who = null, slug = null, thread = null;
  try {
    if (q('c')) {
      const code = String(q('c')).toLowerCase();
      if (!CODE_RE.test(code)) return json({ error: 'bad link' }, 400);
      const idx = await getIndex(c);
      thread = idx.find((x) => x.code === code && !x.archived);
      if (!thread) return json({ error: 'unknown link' }, 404);
      who = 'client'; slug = thread.slug;
      online.set(slug, Date.now());
    } else if (q('k')) {
      const lvl = await keyLevel(q('k'));
      if (lvl < 2) return json({ error: 'forbidden' }, 403);
      who = 'claude'; slug = String(q('t') || '');
      if (!SLUG_RE.test(slug)) return json({ error: 'bad slug' }, 400);
    } else {
      if (!(await crmAuthorized(req, c))) return json({ error: 'unauthorized' }, 401);
      who = 'advon'; slug = q('t') ? String(q('t')) : null;
      if (slug && !SLUG_RE.test(slug)) return json({ error: 'bad slug' }, 400);
    }
  } catch (e) { return json({ error: e.message || 'read failed' }, 502); }

  try {
    // ---- one file → loose blob ----
    if (q('file') === '1') {
      if (limited(req, 'cfile', 200, 60 * 60 * 1000)) return json({ error: 'too many files' }, 429);
      let fd; try { fd = await req.formData(); } catch { return json({ error: 'bad form' }, 400); }
      const file = fd.get('file');
      if (!file || typeof file === 'string') return json({ error: 'no file' }, 400);
      if (file.size > MAX_FILE) return json({ error: 'file too large' }, 413);
      const name = safeName(file.name);
      if (!NAME_OK.test(name)) return json({ error: 'file type not allowed' }, 415);
      const buf = Buffer.from(await file.arrayBuffer());
      const sha = await createBlob(c, buf);
      return json({ ok: true, sha, name, bytes: buf.length, type: file.type || '' });
    }

    // ---- seen ----
    if (q('seen') === '1') {
      if (!slug) return json({ error: 'no thread' }, 400);
      const now = nowIso();
      let changed = false;
      await ghCommit(c, `chat: ${slug} seen by ${who}`, async (ctx) => {
        const { data: idx } = await ctx.readJson(INDEX_PATH, []);
        const list = Array.isArray(idx) ? idx : [];
        const t = list.find((x) => x.slug === slug); if (!t) return null;
        if (who === 'client') { if (!t.unreadClient) return null; t.unreadClient = 0; t.clientSeenAt = now; }
        else { if (!t.unreadAdmin) return null; t.unreadAdmin = 0; t.adminSeenAt = now; }
        changed = true;
        return [{ path: INDEX_PATH, content: JSON.stringify(list, null, 1) }];
      });
      if (changed) forgetHead();
      return json({ ok: true, changed });
    }

    // ---- delete one message (the client takes back their own; the CRM can remove any) ----
    if (q('del')) {
      if (!slug) return json({ error: 'no thread' }, 400);
      const id = clean(q('del'), 40);
      let done = false;
      await ghCommit(c, `chat: ${slug} message deleted by ${who}`, async (ctx) => {
        const { data: idx } = await ctx.readJson(INDEX_PATH, []);
        const list = Array.isArray(idx) ? idx : [];
        const t = list.find((x) => x.slug === slug); if (!t) return null;
        const { data: msgs } = await ctx.readJson(`${DIR}/${slug}/messages.json`, []);
        const arr = Array.isArray(msgs) ? msgs : [];
        const m = arr.find((x) => x.id === id);
        if (!m || m.deleted) return null;
        if (who === 'client' && m.from !== 'client') return null;
        m.deleted = true; m.deletedAt = nowIso(); m.deletedBy = who; m.text = ''; m.files = [];
        const live = arr.filter((x) => !x.deleted);
        const last = live[live.length - 1];
        t.n = arr.length;
        if (last) {
          t.lastAt = last.at; t.lastFrom = last.from;
          t.lastText = (last.text || (last.files && last.files.length ? '\u{1F4CE} ' + last.files.map((f) => f.name).join(', ') : '')).slice(0, 140);
        }
        t.unreadAdmin = arr.filter((x) => x.from === 'client' && !x.deleted && x.at > (t.adminSeenAt || '')).length;
        t.unreadClient = arr.filter((x) => x.from !== 'client' && !x.deleted && x.at > (t.clientSeenAt || '')).length;
        done = true;
        return [
          { path: `${DIR}/${slug}/messages.json`, content: JSON.stringify(arr, null, 1) },
          { path: INDEX_PATH, content: JSON.stringify(list, null, 1) },
        ];
      });
      if (done) forgetHead();
      return json({ ok: true, deleted: done });
    }

    // ---- CRM: create a thread ----
    if (who === 'advon' && q('new') === '1') {
      let body; try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
      const name = clean(body.name, 80);
      if (name.length < 2) return json({ error: 'missing name' }, 400);
      const base = slugify(name);
      let created = null;
      await ghCommit(c, `chat: new thread ${base}`, async (ctx) => {
        const { data: idx } = await ctx.readJson(INDEX_PATH, []);
        const list = Array.isArray(idx) ? idx : [];
        let s = base, n = 2; while (list.some((x) => x.slug === s)) s = `${base}-${n++}`;
        const now = nowIso();
        created = { slug: s, code: `${s}-${rnd(7)}`, name, email: clean(body.email, 120), phone: clean(body.phone, 40), site: clean(body.site, 200), stage: STAGES.includes(body.stage) ? body.stage : 'yliko', dat: !!body.dat, stageAt: now, createdAt: now, lastAt: now, lastFrom: 'advon', lastText: '', n: 0, unreadAdmin: 0, unreadClient: 0, adminSeenAt: now, clientSeenAt: null, archived: false };
        const files = [];
        const msgs = [];
        const wel = (Array.isArray(body.welcome) ? body.welcome : [body.welcome]).map((w) => clean(w, MAX_TEXT)).filter(Boolean).slice(0, 4);
        if (wel.length) {
          wel.forEach((w, i) => msgs.push({ id: msgId() + String(i), from: 'advon', text: w, files: [], at: new Date(Date.parse(now) + i * 1000).toISOString() }));
          created.lastText = wel[wel.length - 1].slice(0, 140); created.n = wel.length; created.unreadClient = wel.length; created.lastAt = msgs[msgs.length - 1].at;
        }
        list.push(created);
        files.push({ path: `${DIR}/${s}/messages.json`, content: JSON.stringify(msgs, null, 1) });
        files.push({ path: INDEX_PATH, content: JSON.stringify(list, null, 1) });
        return files;
      });
      forgetHead();
      return json({ ok: true, thread: created, link: `${SITE_URL}/c/${created.code}` });
    }

    // ---- CRM: the order of the Priority chats ----
    if (who === 'advon' && q('order') === '1') {
      let body; try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
      const slugs = (Array.isArray(body.slugs) ? body.slugs : []).map(String).filter((x) => SLUG_RE.test(x)).slice(0, 200);
      let out = [];
      await ghCommit(c, 'chat: priority order', async (ctx) => {
        const { data: idx } = await ctx.readJson(INDEX_PATH, []);
        const list = Array.isArray(idx) ? idx : [];
        slugs.forEach((sl, i) => { const t = list.find((x) => x.slug === sl); if (t) { t.pin = true; t.ord = i; if (!t.pinAt) t.pinAt = nowIso(); } });
        out = list;
        return [{ path: INDEX_PATH, content: JSON.stringify(list, null, 1) }];
      });
      forgetHead();
      return json({ ok: true, threads: out });
    }

    // ---- CRM: delete a chat for good ----
    if (who === 'advon' && q('remove') === '1') {
      if (!slug) return json({ error: 'no thread' }, 400);
      let gone = null;
      await ghCommit(c, `chat: ${slug} deleted`, async (ctx) => {
        const { data: idx } = await ctx.readJson(INDEX_PATH, []);
        const list = Array.isArray(idx) ? idx : [];
        const t = list.find((x) => x.slug === slug);
        if (!t) return null;
        const files = [];                       // only paths that really exist — GitHub refuses to delete a missing one
        for (const f of await ctx.listDir(`${DIR}/${slug}`)) {
          if (f.type === 'blob') files.push({ path: `${DIR}/${slug}/${f.path}`, content: null });
          else if (f.type === 'tree') for (const g of await ctx.listDir(`${DIR}/${slug}/${f.path}`)) if (g.type === 'blob') files.push({ path: `${DIR}/${slug}/${f.path}/${g.path}`, content: null });
        }
        const nFiles = files.filter((f) => f.path.includes('/files/')).length;
        const { data: del } = await ctx.readJson(`${DIR}/deleted.json`, []);
        const bin = (Array.isArray(del) ? del : []).concat([{ slug, name: t.name, phone: t.phone || '', email: t.email || '', stage: t.stage, n: t.n || 0, files: nFiles, deletedAt: nowIso(), commitBefore: ctx.head ? ctx.head.commit : null }]).slice(-300);
        gone = t;
        files.push({ path: `${DIR}/deleted.json`, content: JSON.stringify(bin, null, 1) });
        files.push({ path: INDEX_PATH, content: JSON.stringify(list.filter((x) => x.slug !== slug), null, 1) });
        return files;
      });
      forgetHead();
      online.delete(slug);
      return json({ ok: true, deleted: !!gone, slug });
    }

    // ---- CRM: edit the card ----
    if (who === 'advon' && q('meta') === '1') {
      if (!slug) return json({ error: 'no thread' }, 400);
      let body; try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
      let out = null;
      await ghCommit(c, `chat: ${slug} card updated`, async (ctx) => {
        const { data: idx } = await ctx.readJson(INDEX_PATH, []);
        const list = Array.isArray(idx) ? idx : [];
        const t = list.find((x) => x.slug === slug); if (!t) throw Object.assign(new Error('no thread'), { code: 'no_thread' });
        if ('name' in body && clean(body.name, 80).length >= 2) t.name = clean(body.name, 80);
        if ('email' in body) t.email = clean(body.email, 120);
        if ('phone' in body) t.phone = clean(body.phone, 40);
        if ('site' in body) t.site = clean(body.site, 200);
        if ('stage' in body && STAGES.includes(body.stage)) { if (t.stage !== body.stage) { t.stage = body.stage; t.stageAt = nowIso(); t.remindersSent = 0; t.lastReminderAt = null; delete t.ready; } }
        if ('form' in body) t.form = !!body.form;                     // the site already has the contact form — the page stops offering it (50€ add-on)
        if ('dat' in body) t.dat = !!body.dat;                        // «has a doctoranytime profile» — the client page then asks only for photos
        if (body.ready === null) delete t.ready;                       // Angelo ticked the READY badge off (the work is done)
        if (typeof body.log === 'string' && body.log.trim()) { t.log = (t.log || []).concat([{ at: nowIso(), by: 'angelo', text: clean(body.log, 400) }]).slice(-30); }
        if ('archived' in body) t.archived = !!body.archived;
        if ('pin' in body) { t.pin = !!body.pin; if (t.pin) { if (typeof t.ord !== 'number') t.ord = list.reduce((m, x) => (x.pin && typeof x.ord === 'number' ? Math.max(m, x.ord + 1) : m), 0); t.pinAt = nowIso(); } else { delete t.ord; delete t.pinAt; } }
        if (body.unread === true) t.unreadAdmin = Math.max(1, t.unreadAdmin || 0);
        if (body.suggest === null) delete t.suggest;
        if (body.newLink === true) t.code = `${t.slug}-${rnd(7)}`;
        out = t;
        return [{ path: INDEX_PATH, content: JSON.stringify(list, null, 1) }];
      });
      forgetHead();
      return json({ ok: true, thread: out, link: `${SITE_URL}/c/${out.code}` });
    }

    // ---- a message ----
    if (!slug) return json({ error: 'no thread' }, 400);
    if (who === 'client' && limited(req, 'cmsg', 120, 60 * 60 * 1000)) return json({ error: 'too many messages' }, 429);
    let body; try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
    const id = msgId();
    const text = clean(body.text, MAX_TEXT);
    const files = who === 'claude' ? [] : normFiles(slug, id, body.files);
    if (!text && !files.length) return json({ error: 'empty' }, 400);
    const msg = { id, from: who, text, files: stripSha(files), at: nowIso() };
    const cid = clean(body.cid, 40); if (/^[\w-]{6,40}$/.test(cid)) msg.cid = cid;
    if (who === 'client' && body.ua) msg.ua = clean(body.ua, 200);
    if (who === 'client' && READY_KINDS.includes(body.kind)) msg.kind = 'ready:' + body.kind;      // a button press, not a plain message
    let t, dup;
    try { ({ thread: t, dup } = await appendMessage(c, slug, msg, files, { clearReady: who !== 'client' && body.clearReady === true })); }
    catch (e) { if (e.code === 'no_thread') return json({ error: 'unknown link' }, 404); throw e; }
    if (dup) return json({ ok: true, message: dup, thread: who === 'client' ? publicThread(t) : t, duplicate: true });
    // e-mail / Telegram go out from netlify/functions/chat-notify.mjs (every 5 min) — nothing to wait for here
    return json({ ok: true, message: msg, thread: who === 'client' ? publicThread(t) : t });
  } catch (e) {
    return json({ error: e.message || 'write failed' }, 502);
  }
}
