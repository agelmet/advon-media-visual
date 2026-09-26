// netlify/functions/social-scheduler.mjs — every 30 minutes (≈8 credits a month of function time): approved posts whose time has come go out (25 Sept 2026)
// Auto-post is ON by default (26 Sept 2026): every post goes out on its date unless skipped / approval taken back.
// Nothing happens while Instagram/Facebook are not connected (posts wait instead of failing).
// A post more than 36 hours late is not published by itself (it waits for «Post now») so an old post never
// surprises anyone after an outage. A post stuck in «posting» for 30 minutes is marked failed with a clear message.
// Manual run: GET /.netlify/functions/social-scheduler?key=<first 12 chars of CRM_AUTH_HASH>&dry=1
import { ghConf, ghReady } from '../../lib/ghdata.js';
import { fetchPlan, merged } from '../../lib/social.js';
import { readState, readCreds, patchPost, kick } from '../../lib/socialrun.js';

export const config = { schedule: '*/30 * * * *' };

export default async (req) => {
  const url = new URL(req.url);
  const manual = url.searchParams.get('key');
  if (manual !== null && manual !== String(process.env.CRM_AUTH_HASH || '').slice(0, 12)) return new Response('forbidden', { status: 403 });
  const dry = url.searchParams.get('dry') === '1';
  const conf = ghConf(); if (!ghReady(conf)) return Response.json({ error: 'storage not configured' }, { status: 503 });
  const now = Date.now();
  let plan, state;
  try { [plan, state] = await Promise.all([fetchPlan(), readState(conf)]); } catch (e) { return Response.json({ error: e.message }, { status: 502 }); }
  const connected = !!(await readCreds(conf));
  const posts = merged(plan, state);
  const stuck = posts.filter((p) => p.status === 'posting' && p.startedAt && now - Date.parse(p.startedAt) > 30 * 60000);
  const due = posts.filter((p) => p.approved && !p.skip && p.status === 'approved' && Date.parse(p.when) <= now && now - Date.parse(p.when) < 36 * 3600000);
  const report = { at: new Date().toISOString(), connected, due: due.map((p) => p.id), stuck: stuck.map((p) => p.id), dry };
  if (!connected) { report.note = 'Not connected yet — nothing posted; approved posts wait (up to 36 h late) for the connection.'; console.log(JSON.stringify(report)); return Response.json(report); }
  if (!dry) {
    for (const p of stuck) await patchPost(conf, p.id, (s) => ({ ...s, status: 'failed', log: [...(s.log || []), { at: new Date().toISOString(), status: 'failed', note: 'No answer from Meta within 30 minutes — press «Post now» to try again.' }] }), `social: stuck ${p.id}`);
    for (const p of due.slice(0, 3)) {
      await patchPost(conf, p.id, (s) => ({ ...s, status: 'posting', startedAt: new Date().toISOString() }), `social: posting ${p.id}`);
    }
    if (due.length) await kick(due.slice(0, 3).map((p) => p.id), ['ig', 'fb']);
  }
  console.log(JSON.stringify(report));
  return Response.json(report);
};
