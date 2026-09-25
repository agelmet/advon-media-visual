// lib/social.js — the «Meta» tab: plan, state, Meta Graph API publishing (25 Sept 2026)
//
// WHERE THINGS LIVE
//   • The content (slides, reels, captions, dates) is prepared by Claude in the PUBLIC repo agelmet/agelmet.github.io (folder advon-social/) and
//     served by GitHub Pages at https://drafts.advonmedia.com/advon-social/ (0 Netlify credits). plan.json there lists
//     every post: {id, date:'YYYY-MM-DD', time:'HH:MM' (Athens), type:'carousel'|'reel', title, caption, hashtags,
//     media:[relative paths], cover?}. Meta downloads the images/videos from those public URLs when it publishes.
//   • What Angelo does with each post lives in the PRIVATE data repo: social/state.json
//       {posts:{<id>:{approved, approvedAt, skip, caption, date, time, status:'posting'|'posted'|'partial'|'failed',
//                     startedAt, postedAt, ig:{id,permalink,error}, fb:{id,permalink,error}, log:[…]}}}
//   • The Meta connection (page token that never expires + ids) lives in social/meta.enc.json, AES-GCM encrypted with
//     a key derived from CRM_AUTH_HASH (server-only env), so the private repo never holds a readable token.
//     META_PAGE_TOKEN / META_PAGE_ID / META_IG_USER_ID env vars, when set, win over the stored connection.
//
// PUBLISHING (Graph API, no third-party tool)
//   Instagram carousel: one container per image (is_carousel_item) → CAROUSEL container with the caption → media_publish.
//   Facebook carousel:  each image uploaded unpublished to /{page}/photos → one /{page}/feed post with attached_media.
//   Instagram reel:     REELS container (video_url, share_to_feed) → wait until FINISHED → media_publish.
//   Facebook reel:      /{page}/video_reels start → rupload with file_url → finish (PUBLISHED).
//   Instagram and Facebook are published independently: one failing never blocks the other («partial»).

import { webcrypto as wc } from 'node:crypto';

export const SOCIAL_BASE = process.env.SOCIAL_BASE || 'https://drafts.advonmedia.com/advon-social/';
export const PLAN_URL = process.env.SOCIAL_PLAN_URL || 'https://raw.githubusercontent.com/agelmet/agelmet.github.io/main/advon-social/plan.json';
export const STATE_PATH = 'social/state.json';
export const CREDS_PATH = 'social/meta.enc.json';
const V = process.env.META_GRAPH_VERSION || 'v23.0';
const GRAPH = `https://graph.facebook.com/${V}`;
const cryptoApi = globalThis.crypto && globalThis.crypto.subtle ? globalThis.crypto : wc;

export const mediaUrl = (p) => (/^https?:/.test(p) ? p : SOCIAL_BASE + String(p).replace(/^\/+/, ''));

// ——— time (Athens) ———
export function athensParts(d = new Date()) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(d).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` };
}
// 'YYYY-MM-DD','HH:MM' in Athens → Date (UTC instant)
export function athensToDate(day, time) {
  const [y, m, d] = day.split('-').map(Number); const [hh, mm] = (time || '10:00').split(':').map(Number);
  let guess = Date.UTC(y, m - 1, d, hh - 3, mm);                       // Athens is UTC+2/+3 — correct with one pass
  for (let i = 0; i < 2; i++) {
    const a = athensParts(new Date(guess));
    const [ay, am, ad] = a.day.split('-').map(Number); const [ah, amin] = a.time.split(':').map(Number);
    const diff = (Date.UTC(y, m - 1, d, hh, mm) - Date.UTC(ay, am - 1, ad, ah, amin));
    guess += diff;
  }
  return new Date(guess);
}

// ——— plan + state ———
export async function fetchPlan() {
  const r = await fetch(PLAN_URL + '?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) throw Object.assign(new Error(`plan.json could not be read (${r.status})`), { code: 'no_plan' });
  const p = await r.json();
  return Array.isArray(p) ? { posts: p } : p;
}
export function merged(plan, state) {
  const S = (state && state.posts) || {};
  return (plan.posts || []).map((p) => {
    const s = S[p.id] || {};
    const date = s.date || p.date, time = s.time || p.time || '19:30';
    return { ...p, date, time, caption: s.caption != null ? s.caption : p.caption, hashtags: s.hashtags != null ? s.hashtags : p.hashtags,
      approved: !!s.approved, skip: !!s.skip, status: s.status || (s.skip ? 'skipped' : s.approved ? 'approved' : 'draft'),
      ig: s.ig || null, fb: s.fb || null, postedAt: s.postedAt || null, startedAt: s.startedAt || null, log: (s.log || []).slice(-6),
      edited: s.caption != null || !!s.date || !!s.time, when: athensToDate(date, time).toISOString() };
  }).sort((a, b) => a.when.localeCompare(b.when));
}
export const fullCaption = (p) => [String(p.caption || '').trim(), String(p.hashtags || '').trim()].filter(Boolean).join('\n\n');

// ——— encrypted Meta credentials ———
async function key() {
  const h = String(process.env.CRM_AUTH_HASH || '').trim();
  if (!h) throw Object.assign(new Error('CRM_AUTH_HASH is not set'), { code: 'no_key' });
  const raw = await cryptoApi.subtle.digest('SHA-256', new TextEncoder().encode('advon-meta|' + h));
  return cryptoApi.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
export async function sealCreds(obj) {
  const iv = cryptoApi.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await cryptoApi.subtle.encrypt({ name: 'AES-GCM', iv }, await key(), new TextEncoder().encode(JSON.stringify(obj))));
  return { v: 1, iv: Buffer.from(iv).toString('base64'), ct: Buffer.from(ct).toString('base64'), at: new Date().toISOString() };
}
export async function openCreds(box) {
  if (!box || !box.iv || !box.ct) return null;
  const pt = await cryptoApi.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(box.iv, 'base64') }, await key(), Buffer.from(box.ct, 'base64'));
  return JSON.parse(new TextDecoder().decode(pt));
}
export function envCreds() {
  const t = process.env.META_PAGE_TOKEN, pg = process.env.META_PAGE_ID, ig = process.env.META_IG_USER_ID;
  return t && pg && ig ? { pageToken: t, pageId: pg, igId: ig, pageName: process.env.META_PAGE_NAME || '', igUsername: process.env.META_IG_USERNAME || '', source: 'env' } : null;
}

// ——— Graph API ———
async function graph(path, { method = 'GET', params = {}, token } = {}) {
  const u = new URL(path.startsWith('http') ? path : GRAPH + path);
  const body = new URLSearchParams();
  const all = { ...params }; if (token) all.access_token = token;
  for (const [k, v] of Object.entries(all)) { if (v === undefined || v === null) continue; (method === 'GET' ? u.searchParams : body).set(k, typeof v === 'object' ? JSON.stringify(v) : String(v)); }
  const r = await fetch(u, method === 'GET' ? { cache: 'no-store' } : { method, body, cache: 'no-store' });
  const txt = await r.text(); let j; try { j = JSON.parse(txt); } catch { j = { raw: txt }; }
  if (!r.ok || j.error) {
    const e = j.error || {};
    throw Object.assign(new Error(e.error_user_msg || e.message || `Meta error ${r.status}`), { code: 'meta', status: r.status, meta: { type: e.type, code: e.code, sub: e.error_subcode, trace: e.fbtrace_id } });
  }
  return j;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Turn what Angelo pastes (a short-lived user token from the Graph API Explorer + the app id/secret) into a page token
// that does not expire, and find the Instagram account linked to the page. The app secret is used once and not kept.
export async function connectMeta({ userToken, appId, appSecret, pageHint }) {
  if (!userToken) throw Object.assign(new Error('Paste the access token first.'), { code: 'bad_input' });
  let longUser = userToken;
  if (appId && appSecret) {
    const x = await graph('/oauth/access_token', { params: { grant_type: 'fb_exchange_token', client_id: appId, client_secret: appSecret, fb_exchange_token: userToken } });
    longUser = x.access_token || userToken;
  }
  const acc = await graph('/me/accounts', { token: longUser, params: { fields: 'id,name,access_token,instagram_business_account{id,username}', limit: 50 } });
  const pages = (acc.data || []).filter((p) => p.access_token);
  if (!pages.length) throw Object.assign(new Error('This Facebook user manages no pages (or the token lacks pages_show_list).'), { code: 'no_pages' });
  const hint = String(pageHint || 'advon').toLowerCase();
  const page = pages.find((p) => p.instagram_business_account && p.name.toLowerCase().includes(hint)) || pages.find((p) => p.instagram_business_account) || pages[0];
  if (!page.instagram_business_account) throw Object.assign(new Error(`The page «${page.name}» has no Instagram professional account linked to it.`), { code: 'no_ig' });
  return { pageId: page.id, pageName: page.name, pageToken: page.access_token, igId: page.instagram_business_account.id, igUsername: page.instagram_business_account.username || '', connectedAt: new Date().toISOString(), longLived: !!(appId && appSecret) };
}
export async function checkMeta(c) {
  const [pg, ig] = await Promise.all([
    graph(`/${c.pageId}`, { token: c.pageToken, params: { fields: 'id,name' } }),
    graph(`/${c.igId}`, { token: c.pageToken, params: { fields: 'id,username' } }),
  ]);
  return { pageName: pg.name, igUsername: ig.username };
}

async function igWait(c, container, maxMs) {
  const t0 = Date.now();
  for (;;) {
    const s = await graph(`/${container}`, { token: c.pageToken, params: { fields: 'status_code,status' } });
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw Object.assign(new Error('Instagram could not process the media: ' + (s.status || s.status_code)), { code: 'meta' });
    if (Date.now() - t0 > maxMs) throw Object.assign(new Error('Instagram is still processing the media — try «Post now» again in a few minutes.'), { code: 'timeout' });
    await sleep(4000);
  }
}
async function igPermalink(c, id) { try { return (await graph(`/${id}`, { token: c.pageToken, params: { fields: 'permalink' } })).permalink || ''; } catch { return ''; } }

export async function igCarousel(c, urls, caption) {
  if (urls.length === 1) {
    const one = await graph(`/${c.igId}/media`, { method: 'POST', token: c.pageToken, params: { image_url: urls[0], caption } });
    await igWait(c, one.id, 60000);
    const pub = await graph(`/${c.igId}/media_publish`, { method: 'POST', token: c.pageToken, params: { creation_id: one.id } });
    return { id: pub.id, permalink: await igPermalink(c, pub.id) };
  }
  const kids = [];
  for (const u of urls.slice(0, 10)) kids.push((await graph(`/${c.igId}/media`, { method: 'POST', token: c.pageToken, params: { image_url: u, is_carousel_item: true } })).id);
  for (const k of kids) await igWait(c, k, 90000);
  const car = await graph(`/${c.igId}/media`, { method: 'POST', token: c.pageToken, params: { media_type: 'CAROUSEL', children: kids.join(','), caption } });
  await igWait(c, car.id, 90000);
  const pub = await graph(`/${c.igId}/media_publish`, { method: 'POST', token: c.pageToken, params: { creation_id: car.id } });
  return { id: pub.id, permalink: await igPermalink(c, pub.id) };
}
export async function fbCarousel(c, urls, caption) {
  const ids = [];
  for (const u of urls.slice(0, 10)) ids.push((await graph(`/${c.pageId}/photos`, { method: 'POST', token: c.pageToken, params: { url: u, published: false } })).id);
  const params = { message: caption }; ids.forEach((id, i) => (params[`attached_media[${i}]`] = { media_fbid: id }));
  const post = await graph(`/${c.pageId}/feed`, { method: 'POST', token: c.pageToken, params });
  let permalink = ''; try { permalink = (await graph(`/${post.id}`, { token: c.pageToken, params: { fields: 'permalink_url' } })).permalink_url || ''; } catch {}
  return { id: post.id, permalink };
}
export async function igReel(c, videoUrl, coverUrl, caption) {
  const cont = await graph(`/${c.igId}/media`, { method: 'POST', token: c.pageToken, params: { media_type: 'REELS', video_url: videoUrl, cover_url: coverUrl || undefined, caption, share_to_feed: true } });
  await igWait(c, cont.id, 8 * 60000);
  const pub = await graph(`/${c.igId}/media_publish`, { method: 'POST', token: c.pageToken, params: { creation_id: cont.id } });
  return { id: pub.id, permalink: await igPermalink(c, pub.id) };
}
export async function fbReel(c, videoUrl, caption) {
  const start = await graph(`/${c.pageId}/video_reels`, { method: 'POST', token: c.pageToken, params: { upload_phase: 'start' } });
  const up = await fetch(`https://rupload.facebook.com/video-upload/${V}/${start.video_id}`, { method: 'POST', headers: { Authorization: `OAuth ${c.pageToken}`, file_url: videoUrl } });
  if (!up.ok) throw Object.assign(new Error('Facebook did not accept the video file: ' + (await up.text()).slice(0, 200)), { code: 'meta' });
  await graph(`/${c.pageId}/video_reels`, { method: 'POST', token: c.pageToken, params: { upload_phase: 'finish', video_id: start.video_id, video_state: 'PUBLISHED', description: caption } });
  return { id: start.video_id, permalink: `https://www.facebook.com/reel/${start.video_id}` };
}

// Publish one merged post to the chosen networks. Never throws: returns {ig, fb} each {id,permalink} or {error}.
export async function publishPost(c, p, targets = ['ig', 'fb']) {
  const cap = fullCaption(p);
  const urls = (p.media || []).map(mediaUrl);
  const out = {};
  const run = async (net, fn) => { try { out[net] = await fn(); } catch (e) { out[net] = { error: e.message || String(e), meta: e.meta || null }; } };
  if (p.type === 'reel') {
    const video = urls[0], cover = p.cover ? mediaUrl(p.cover) : undefined;
    await Promise.all([targets.includes('ig') && run('ig', () => igReel(c, video, cover, cap)), targets.includes('fb') && run('fb', () => fbReel(c, video, cap))]);
  } else {
    await Promise.all([targets.includes('ig') && run('ig', () => igCarousel(c, urls, cap)), targets.includes('fb') && run('fb', () => fbCarousel(c, urls, cap))]);
  }
  return out;
}
