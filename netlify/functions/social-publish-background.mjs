// netlify/functions/social-publish-background.mjs — publishes posts to Instagram + Facebook (25 Sept 2026)
// A background function (answers 202 at once, may run up to 15 minutes — reels need a minute or two at Meta).
// Called only by /api/social («Post now») and by social-scheduler.mjs, with a key derived from CRM_AUTH_HASH.
// Body: {key, ids:[postId…], targets:['ig','fb']}. Results land in social/state.json + one Telegram per post.
import { internalKey, runPublish } from '../../lib/socialrun.js';

export default async (req) => {
  let body = {}; try { body = await req.json(); } catch {}
  if (!body.key || body.key !== (await internalKey())) return new Response('forbidden', { status: 403 });
  const ids = Array.isArray(body.ids) ? body.ids.slice(0, 5).map(String) : [];
  const targets = Array.isArray(body.targets) && body.targets.length ? body.targets.filter((t) => t === 'ig' || t === 'fb') : ['ig', 'fb'];
  if (!ids.length) return new Response('nothing to do');
  const out = await runPublish(ids, targets);
  console.log(JSON.stringify({ at: new Date().toISOString(), ids, targets, out }));
  return new Response('ok');
};
