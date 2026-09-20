// lib/backupcore.js — the safety net behind the CRM's «Backup everything» (20 Sept 2026)
//
// Shared by app/api/backup/route.js and netlify/functions/weekly-backup.mjs.
//   • listRepo(conf)        every file of the private data repo at the current head (one recursive tree call),
//                           snapshots/ left out (they are hourly copies of crm-data.json — the live file is enough)
//   • buildSafetyZip(conf)  a small .zip with what cannot be rebuilt from anywhere else: crm-data.json (the CRM, still
//                           locked with Angelo's passphrase), every chat (index + messages, no attachments), the leads
//                           files and a READ ME. Attachments stay out so the file always fits in an e-mail.
//   • sendSafetyCopy(conf)  e-mails that zip to LEAD_NOTIFY_TO through Resend — every Monday by itself, or on demand.

import zlib from 'node:zlib';
import { ghFetch, ghFailure, head, blobBuffer } from './ghdata.js';
import { mailConf, emailOk } from './chatcore.js';

const SKIP = /^snapshots\//;

export async function listRepo(conf) {
  const h = await head(conf);
  if (!h) return { head: null, files: [], snapshots: 0 };
  const r = await ghFetch(conf, `git/trees/${h.tree}?recursive=1`);
  if (!r.ok) throw ghFailure(r.status, await r.text());
  const j = await r.json();
  const blobs = (j.tree || []).filter((x) => x.type === 'blob');
  return {
    head: h.commit,
    truncated: !!j.truncated,
    snapshots: blobs.filter((x) => SKIP.test(x.path)).length,
    files: blobs.filter((x) => !SKIP.test(x.path)).map((x) => ({ path: x.path, sha: x.sha, size: x.size })),
  };
}

// ---------- a minimal zip writer (deflate) ----------
let CRC_T = null;
function crc32(buf) {
  if (!CRC_T) { CRC_T = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CRC_T[n] = c >>> 0; } }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
export function zip(files) {
  const parts = [], central = []; let off = 0;
  const d = new Date();
  const dosT = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dosD = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (const f of files) {
    const name = Buffer.from(f.name, 'utf8'), raw = Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data, 'utf8');
    const z = zlib.deflateRawSync(raw, { level: 9 });
    const body = z.length < raw.length ? z : raw, method = body === z ? 8 : 0, crc = crc32(raw);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6); lh.writeUInt16LE(method, 8); lh.writeUInt16LE(dosT, 10); lh.writeUInt16LE(dosD, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(body.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(name.length, 26);
    parts.push(lh, name, body);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(method, 10); ch.writeUInt16LE(dosT, 12); ch.writeUInt16LE(dosD, 14);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(body.length, 20); ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(off, 42);
    central.push(ch, name);
    off += 30 + name.length + body.length;
  }
  const csize = central.reduce((a, p) => a + p.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(csize, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...parts, ...central, end]);
}

const README = (when, repo, n) => `ADVON — WEEKLY SAFETY COPY
==========================
Made by the server on ${when}. Nobody pressed anything — it is sent every Monday.

WHAT IS INSIDE (${n} files, from the private data repo ${repo})
  server/crm-data.json          the whole CRM — still LOCKED with your CRM username + passphrase (safe to keep in e-mail)
  server/chats/…                every client chat: the list and all the messages (photos and files are not in this small copy)
  server/leads/…                the lead lists and the ads inbox
  server/brief/…, intake lists  the small files the agents use

HOW TO USE IT
  You normally never need it. It is the net under the net: if the data repo is ever damaged or deleted, give this file to
  Claude and say «put this safety copy back into the data repo». Every path under server/ goes back to the same path in the
  repo; the CRM then opens with your usual passphrase as if nothing happened.

  For a COMPLETE copy (with the chat photos and files, and a version of the CRM you can read without the passphrase), open
  the CRM → Export → «Backup everything». Do that every couple of weeks and after big changes.
`;

export async function buildSafetyZip(conf) {
  const tree = await listRepo(conf);
  const want = tree.files.filter((f) => f.path === 'crm-data.json' || /^chats\/(index|outbox|deleted)\.json$/.test(f.path) || /^chats\/[^/]+\/messages\.json$/.test(f.path) || /^leads\/[^/]+\.json$/.test(f.path) || /^brief\/[^/]+\.json$/.test(f.path) || f.path === 'intake/queue.json');
  const files = [];
  let i = 0;
  const worker = async () => { while (i < want.length) { const f = want[i++]; try { files.push({ name: 'server/' + f.path, data: await blobBuffer(conf, f.sha) }); } catch { /* one unreadable file must not stop the copy */ } } };
  await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
  files.sort((a, b) => a.name.localeCompare(b.name));
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Athens' }) + ' (Athens)';
  const manifest = { format: 'advon-safety-copy', version: 1, madeAt: new Date().toISOString(), repo: conf.repo, branch: conf.branch, head: tree.head, files: files.map((f) => ({ path: f.name, bytes: f.data.length })), leftOut: tree.files.length - files.length };
  const all = [{ name: 'READ ME.txt', data: README(when, conf.repo, files.length) }, ...files, { name: 'manifest.json', data: JSON.stringify(manifest, null, 1) }];
  const chats = files.filter((f) => /messages\.json$/.test(f.name)).length;
  return { buffer: zip(all), count: files.length, chats, head: tree.head, hasCrm: files.some((f) => f.name === 'server/crm-data.json') };
}

export async function sendSafetyCopy(conf, why = 'weekly') {
  const mc = mailConf();
  if (!mc.resendKey) return { ok: false, error: 'RESEND_API_KEY is not set in Netlify' };
  if (!emailOk(mc.notifyTo)) return { ok: false, error: 'no address to send to (LEAD_NOTIFY_TO)' };
  const z = await buildSafetyZip(conf);
  if (z.buffer.length > 30 * 1024 * 1024) return { ok: false, error: 'the safety copy is too large to e-mail' };
  const day = new Date().toISOString().slice(0, 10);
  const name = `ADVON-SAFETY-COPY-${day}.zip`;
  const kb = Math.round(z.buffer.length / 1024);
  const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const li = (t) => `<li style="margin:0 0 6px">${t}</li>`;
  const html = `<div style="background:#F3F5F9;padding:24px 12px"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #E6E9F0;font-family:${F};color:#10141F;line-height:1.55">
    <div style="background:#0B0E12;padding:16px 26px"><span style="font:800 12px ${F};letter-spacing:.18em;text-transform:uppercase;color:#fff">Advon CRM · Safety copy</span></div>
    <div style="padding:24px 26px 26px">
      <span style="display:inline-block;background:#0B9E5C;color:#fff;font:800 11px ${F};letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:6px 12px">${why === 'weekly' ? 'Every Monday' : 'You asked for it'}</span>
      <h1 style="font:800 22px ${F};margin:12px 0 6px">Your safety copy is attached</h1>
      <p style="margin:0 0 16px;font-size:14px;color:#5C6575">${name} · ${kb} KB · made ${day}</p>
      <p style="margin:0 0 8px;font:800 12px ${F};letter-spacing:.1em;text-transform:uppercase">What is inside</p>
      <ul style="margin:0 0 16px;padding-left:18px;font-size:14.5px">${li(z.hasCrm ? 'The whole CRM — clients, money, renewals, calls (locked with your passphrase, so it is safe in e-mail)' : '<b style="color:#C4243A">The CRM file was NOT found on the server — open the CRM and check that sync is green.</b>')}${li(`${z.chats} client chat${z.chats === 1 ? '' : 's'} with every message`)}${li('The lead lists and the ads inbox')}</ul>
      <p style="margin:0 0 8px;font:800 12px ${F};letter-spacing:.1em;text-transform:uppercase">What you do</p>
      <ul style="margin:0;padding-left:18px;font-size:14.5px">${li('Nothing. Just leave this e-mail where it is — it is the net under the net.')}${li('If something is ever lost, forward the attachment to Claude and say «put this safety copy back».')}${li('For a complete copy with the chat photos and files: CRM → Export → «Backup everything».')}</ul>
    </div></div></div>`;
  const text = `Your Advon safety copy is attached (${name}, ${kb} KB).\n\nInside: the whole CRM (locked with your passphrase), ${z.chats} client chats with every message, the lead lists.\n\nYou do nothing — keep this e-mail. If something is ever lost, give the attachment to Claude and say «put this safety copy back».\nFor a complete copy with the chat photos and files: CRM → Export → «Backup everything».`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${mc.resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: mc.from.replace(/^[^<]*</, 'Advon CRM <'), to: [mc.notifyTo], subject: `🛟 Advon safety copy · ${day}`, text, html, attachments: [{ filename: name, content: z.buffer.toString('base64') }] }),
  });
  if (!r.ok) { let msg = ''; try { msg = (await r.json()).message || ''; } catch {} return { ok: false, error: `resend ${r.status} ${msg}`.trim() }; }
  return { ok: true, to: mc.notifyTo, bytes: z.buffer.length, files: z.count, chats: z.chats };
}
