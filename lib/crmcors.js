/* The CRM lives on its own address since 5 Oct 2026 — https://crm.advonmedia.com (GitHub Pages,
   so changing the CRM costs no Netlify deploys). It still talks to these /api endpoints on
   advonmedia.com, cross-origin. Every CRM endpoint is wrapped with crmCors / crmPreflight:
   only requests coming FROM the CRM's address get the CORS headers; everything else
   (the client chat page, /ylika, the doctoranytime harvester) is answered exactly as before.
   The endpoints still demand the CRM token (x-crm-auth) — CORS only lets the browser ask. */
export const CRM_ORIGINS = ['https://crm.advonmedia.com', 'https://drafts.advonmedia.com'];

function crmOrigin(req) {
  try { const o = req && req.headers && req.headers.get('origin'); return o && CRM_ORIGINS.includes(o) ? o : ''; } catch { return ''; }
}
function stamp(h, o) {
  h.set('Access-Control-Allow-Origin', o);
  h.append('Vary', 'Origin');
  h.set('Access-Control-Expose-Headers', '*');
}
function withHeaders(res, o) {
  try { stamp(res.headers, o); return res; }
  catch { /* immutable headers (a fetch() passed straight through) — copy it */
    const r = new Response(res.body, { status: res.status, statusText: res.statusText, headers: new Headers(res.headers) });
    stamp(r.headers, o); return r;
  }
}
export function crmCors(fn) {
  return async (req, ctx) => {
    const res = await fn(req, ctx);
    const o = crmOrigin(req);
    return o && res ? withHeaders(res, o) : res;
  };
}
export function crmPreflight(fn) {
  return async (req, ctx) => {
    const o = crmOrigin(req);
    if (o) {
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': o,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': (req.headers.get('access-control-request-headers') || 'x-crm-auth, content-type'),
        'Access-Control-Max-Age': '600',
        'Cache-Control': 'no-store',
        Vary: 'Origin',
      } });
    }
    if (fn) return fn(req, ctx);
    return new Response(null, { status: 204, headers: { Allow: 'GET, POST, PUT, OPTIONS' } });
  };
}
