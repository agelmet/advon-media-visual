// netlify/functions/weekly-backup.mjs — the net under the net (20 Sept 2026)
//
// Every Monday at 05:30 UTC (08:30 in Athens, 07:30 in winter) the server e-mails Angelo a small .zip with everything that
// cannot be rebuilt from anywhere else: crm-data.json (the CRM, still locked with his passphrase), every chat with all
// its messages, the lead lists. No one has to press anything; if GitHub, the data repo or the Mac are ever lost, the
// latest copy is sitting in his inbox. The complete copy (with chat attachments, readable without the passphrase) is the
// CRM's Export → «Backup everything».
// Needs RESEND_API_KEY (already set for the chat notifications). Sent to LEAD_NOTIFY_TO (default advonmd@gmail.com).
// Test it without waiting for Monday: CRM → Export → «E-mail me a safety copy now» (POST /api/backup?mail=1).

import { ghConf, ghReady } from '../../lib/ghdata.js';
import { sendSafetyCopy } from '../../lib/backupcore.js';

export const config = { schedule: '30 5 * * 1' };

export default async () => {
  const conf = ghConf();
  if (!ghReady(conf)) return Response.json({ error: 'storage not configured' }, { status: 503 });
  let out;
  try { out = await sendSafetyCopy(conf, 'weekly'); } catch (e) { out = { ok: false, error: e.message }; }
  console.log(JSON.stringify({ weeklyBackup: out }));
  return Response.json(out);
};
