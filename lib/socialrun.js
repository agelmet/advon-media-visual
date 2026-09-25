// lib/socialrun.js — shared by /api/social, the 15-minute scheduler and the background publisher (25 Sept 2026)
import { ghConf, ghReady, mutateJson, readAtHead } from './ghdata.js';
import { mailConf, sendTelegram, tgEsc } from './chatcore.js';
import { STATE_PATH, CREDS_PATH, fetchPlan, merged, openCreds, envCreds, publishPost } from './social.js';

export async function readState(conf) {
  try { const r = await readAtHead(conf, STATE_PATH); const s = r && r.text ? JSON.parse(r.text) : null; return s && typeof s === 'object' && s.posts ? s : { posts: {} }; }
  catch { return { posts: {} }; }
}
export async function readCreds(conf) {
  const env = envCreds(); if (env) return env;
  try { const r = await readAtHead(conf, CREDS_PATH); return r && r.text ? { ...(await openCreds(JSON.parse(r.text))), source: 'crm' } : null; } catch { return null; }
}
export const patchPost = (conf, id, fn, msg) => mutateJson(conf, STATE_PATH, (s) => {
  const st = s && s.posts ? s : { posts: {} };
  const cur = st.posts[id] || {};
  const next = fn({ ...cur });
  if (next === undefined) return undefined;
  st.posts[id] = next; st.updated = new Date().toISOString();
  return st;
}, msg || `social: ${id}`, { posts: {} });

// the key the scheduler/API use to call the background function (derived, never stored)
export async function internalKey() {
  const h = String(process.env.CRM_AUTH_HASH || '');
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(h + '|social-run'));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 40);
}
export function siteUrl() { return process.env.URL || 'https://advonmedia.com'; }
export async function kick(ids, targets) {
  const key = await internalKey();
  // background functions answer 202 at once and keep running up to 15 minutes
  await fetch(`${siteUrl()}/.netlify/functions/social-publish-background`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, ids, targets }) });
}

// Publish the given post ids now (called inside the background function).
export async function runPublish(ids, targets = ['ig', 'fb']) {
  const conf = ghConf(); if (!ghReady(conf)) return { error: 'storage not configured' };
  const creds = await readCreds(conf);
  const plan = await fetchPlan(); const state = await readState(conf);
  const posts = merged(plan, state).filter((p) => ids.includes(p.id));
  const mc = mailConf(); const report = [];
  for (const p of posts) {
    let res;
    if (!creds) res = { ig: { error: 'Instagram/Facebook are not connected yet (Meta tab → Connect).' }, fb: { error: 'not connected' } };
    else res = await publishPost(creds, p, targets);
    const okIg = res.ig && res.ig.id, okFb = res.fb && res.fb.id;
    const wanted = targets.length;
    const good = [okIg, okFb].filter(Boolean).length;
    const status = good === 0 ? 'failed' : good < wanted ? 'partial' : 'posted';
    await patchPost(conf, p.id, (s) => ({ ...s, status, postedAt: good ? new Date().toISOString() : s.postedAt || null,
      ig: res.ig || s.ig || null, fb: res.fb || s.fb || null,
      log: [...(s.log || []), { at: new Date().toISOString(), status, ig: res.ig && (res.ig.error || 'ok'), fb: res.fb && (res.fb.error || 'ok') }].slice(-12) }), `social: ${status} ${p.id}`);
    report.push({ id: p.id, status, ig: res.ig, fb: res.fb });
    const lines = [`<b>${status === 'posted' ? '✅ Posted' : status === 'partial' ? '⚠️ Posted in part' : '❌ Not posted'}</b> — ${tgEsc(p.title || p.id)}`];
    if (targets.includes('ig')) lines.push(`Instagram: ${okIg ? tgEsc(res.ig.permalink || 'ok') : '✗ ' + tgEsc(res.ig && res.ig.error)}`);
    if (targets.includes('fb')) lines.push(`Facebook: ${okFb ? tgEsc(res.fb.permalink || 'ok') : '✗ ' + tgEsc(res.fb && res.fb.error)}`);
    try { await sendTelegram(mc, lines.join('\n'), { buttons: [{ text: 'Open the Meta tab', url: 'https://advonmedia.com/crm/#meta' }] }); } catch {}
  }
  return { report };
}
