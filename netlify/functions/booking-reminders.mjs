// netlify/functions/booking-reminders.mjs — reminder e-mails for calls booked on /rantevou (20 Nov 2026).
//
// Every 10 minutes: reads bookings/online.json (data repo), and for each confirmed call still ahead sends
//   • the day-before reminder ~24 h before (only when the call was booked more than ~26 h ahead), and
//   • the reminder ~1 h before (50–60 minutes before, given the 10-minute rhythm).
// Each one is marked in booking.sent so it never goes twice. See lib/booking.js dueReminder().
// Scheduled functions run on the PRODUCTION deploy only. Manual run:
//   GET https://advonmedia.com/.netlify/functions/booking-reminders?key=<first 12 chars of CRM_AUTH_HASH>[&dry=1]

import { ghConf, ghReady, commit, readAtHead } from '../../lib/ghdata.js';
import { BOOKING, dueReminder, sendBookingMail } from '../../lib/booking.js';

export const config = { schedule: '*/10 * * * *' };

export default async (req) => {
  const url = new URL(req.url);
  const manual = url.searchParams.get('key');
  if (manual !== null) {
    const want = String(process.env.CRM_AUTH_HASH || '').slice(0, 12);
    if (!want || manual !== want) return new Response('forbidden', { status: 403 });
  }
  const dry = url.searchParams.get('dry') === '1';
  const conf = ghConf();
  if (!ghReady(conf)) return new Response('not configured', { status: 500 });

  const r = await readAtHead(conf, BOOKING.path);
  let items = [];
  try { items = JSON.parse(r.text || '{}').items || []; } catch {}
  const now = Date.now();
  const due = items.map((bk) => ({ bk, kind: dueReminder(bk, now) })).filter((x) => x.kind);
  if (!due.length || dry) return Response.json({ ok: true, dry, due: due.map((x) => ({ ref: x.bk.ref, kind: x.kind, day: x.bk.day, time: x.bk.time })) });

  const sent = [];
  for (const { bk, kind } of due) {
    const m = await sendBookingMail(kind, bk, 'https://advonmedia.com');
    if (m.ok) sent.push({ id: bk.id, kind, at: new Date().toISOString() });
    else console.error('[booking-reminders]', bk.ref, kind, m.why);
  }
  if (sent.length) {
    await commit(conf, `Booking reminders sent: ${sent.map((s) => s.kind).join(', ')}`, async (ctx) => {
      const { data } = await ctx.readJson(BOOKING.path, { items: [] });
      const list = Array.isArray(data?.items) ? data.items : [];
      for (const s of sent) {
        const x = list.find((b) => b.id === s.id);
        if (x) x.sent = { ...(x.sent || {}), [s.kind]: s.at };
      }
      return [{ path: BOOKING.path, content: JSON.stringify({ items: list }, null, 1) }];
    });
  }
  return Response.json({ ok: true, sent });
};
