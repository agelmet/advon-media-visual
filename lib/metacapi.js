// lib/metacapi.js — report a lead to Meta from the server (Conversions API, 9 Nov 2026)
// Used by /api/lead (the ads form) and /api/verify (the e-mail code before the booking calendar).
// Sent: the ad click id (as fbc), the browser type, the page, the time, an event_id shared with the
// pixel event (Meta counts them once). NEVER name, phone, e-mail or IP. Needs META_CAPI_TOKEN; without
// it, or without a click id from a Meta ad, it does nothing.
const META_PIXEL_ID = '1294424308606812';
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

export async function sendMetaLead(req, body, contentName) {
  const token = process.env.META_CAPI_TOKEN;
  const fbclid = clean(body && body.fbclid, 500);
  if (!token || !fbclid || !/^[A-Za-z0-9_-]{10,500}$/.test(fbclid)) return false;
  const now = Date.now();
  let ts = Number(body.fbclid_ts) || now;
  if (ts > now || now - ts > 90 * 864e5) ts = now;
  const page = clean(body.page, 200).split('?')[0] || '/istoselida';
  const event = {
    event_name: 'Lead',
    event_time: Math.floor(now / 1000),
    event_id: clean(body.event_id, 80) || undefined,
    action_source: 'website',
    event_source_url: `https://advonmedia.com${page.startsWith('/') ? page : '/' + page}`,
    user_data: { fbc: `fb.1.${ts}.${fbclid}`, client_user_agent: clean(req.headers.get('user-agent'), 400) || undefined },
    custom_data: { content_name: clean(contentName || body.source, 40) || 'istoselida' },
  };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 4000);
  try {
    const res = await fetch(`https://graph.facebook.com/v24.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }), signal: ctl.signal,
    });
    if (!res.ok) console.error('[meta capi]', res.status, (await res.text()).slice(0, 300));
    return res.ok;
  } catch (e) {
    console.error('[meta capi] failed', e?.message);
    return false;
  } finally { clearTimeout(t); }
}
