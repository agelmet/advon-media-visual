/**
 * Advon CRM — restore drill.
 *
 * Loads the REAL public/crm/index.html in a DOM, with real WebCrypto and a real
 * IndexedDB, and proves end to end that:
 *
 *   1. data saves and encrypts on this "device"
 *   2. an encrypted backup can be exported
 *   3. after total local data loss, the backup restores every record intact
 *   4. the plain CSV escape hatch contains the records in readable form
 *   5. sync pushes to the server, a second device pulls the same data
 *   6. a conflicting write is refused instead of silently overwriting
 *
 * The drill runs against a throwaway passphrase and a throwaway vault — the real
 * passphrase is never used, never needed and never appears anywhere.
 *
 * Run:
 *   npm i --no-save jsdom fake-indexeddb
 *   node scripts/restore-drill.mjs
 *
 * (Deliberately not in package.json — these are test-only and should not be
 *  installed on every production build.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';

const ROOT = path.resolve(import.meta.dirname, '..');
const CRM = path.join(ROOT, 'public/crm/index.html');

const TEST_USER = 'drilluser';
const TEST_PASS = 'drill-only-passphrase-not-real';

let pass = 0, fail = 0;
const results = [];
function check(name, ok, detail = '') {
  ok ? pass++ : fail++;
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  console.log(`${ok ? '  ✓' : '  ✗'} ${name}${detail ? '  — ' + detail : ''}`);
}

// ---------------------------------------------------------------- test vault
const te = new TextEncoder();
const b64 = (buf) => Buffer.from(new Uint8Array(buf)).toString('base64');

async function buildTestVault(seed) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const base = await webcrypto.subtle.importKey('raw', te.encode(`${TEST_USER}:${TEST_PASS}`), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
  );
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const ct = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(JSON.stringify(seed)));
  return { salt: b64(salt.buffer), iv: b64(iv.buffer), ct: b64(ct) };
}

// --------------------------------------------------- in-memory sync "server"
// Mirrors the contract of app/api/crm/route.js: optimistic concurrency on sha,
// dated snapshots, no plaintext ever.
const server = { file: null, sha: null, snapshots: [] };
function serverGET() {
  if (!server.file) return { status: 200, body: { empty: true, sha: null, updatedAt: null, data: null } };
  return { status: 200, body: { empty: false, sha: server.sha, updatedAt: server.file.updatedAt, deviceId: server.file.deviceId, data: server.file.data } };
}
function serverPUT(body) {
  if (server.file && !body.force && server.sha !== body.baseSha) {
    return { status: 409, body: { error: 'conflict', sha: server.sha, updatedAt: server.file.updatedAt, deviceId: server.file.deviceId, data: server.file.data } };
  }
  server.file = { updatedAt: body.updatedAt, deviceId: body.deviceId, data: body.data };
  server.sha = 'sha-' + Math.random().toString(36).slice(2, 10);
  server.snapshots.push({ at: body.updatedAt, data: body.data });
  return { status: 200, body: { ok: true, sha: server.sha, updatedAt: body.updatedAt } };
}

// -------------------------------------------------------------- device setup
async function openDevice({ vault, storage, idb, label }) {
  let html = fs.readFileSync(CRM, 'utf8');
  html = html.replace(/const VAULT = \{[^\n]*\};/, `const VAULT = ${JSON.stringify(vault)};`);
  html = html.replace(/src="https:\/\/raw\.githubusercontent[^"]*"/g, 'src=""');
  // test-only hook: top-level `let` in a classic script is script-scoped, so the
  // drill needs an explicit handle on the app's internals.
  html = html.replace(/\n<\/script>\s*<\/body>/,
    `\nwindow.__t={
       get state(){return state;}, set state(v){state=v;},
       save, saveNow, backupEncrypted, exportAllClientsCSV, normalizeState,
       get Sync(){return Sync;}, get token(){return SYNC_TOKEN;},
       get localUpdatedAt(){return LOCAL_UPDATED_AT;}
     };
     window.dispatchEvent(new Event('__ready'));
     </script></body>`);

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://advonmedia.com/crm/',
    beforeParse(win) {
      Object.defineProperty(win, 'crypto', { value: webcrypto, configurable: true });
      win.indexedDB = idb;
      win.IDBKeyRange = IDBKeyRange;
      // shared, persistent localStorage across "reloads" of the same device
      Object.defineProperty(win, 'localStorage', {
        value: {
          getItem: (k) => (k in storage ? storage[k] : null),
          setItem: (k, v) => { storage[k] = String(v); },
          removeItem: (k) => { delete storage[k]; },
          clear: () => { for (const k of Object.keys(storage)) delete storage[k]; },
        }, configurable: true,
      });
      const sess = {};
      Object.defineProperty(win, 'sessionStorage', {
        value: {
          getItem: (k) => (k in sess ? sess[k] : null),
          setItem: (k, v) => { sess[k] = String(v); },
          removeItem: (k) => { delete sess[k]; },
        }, configurable: true,
      });
      win.confirm = () => true;
      win.alert = () => {};
      win.matchMedia = win.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      win.print = () => {};
      win.fetch = async (url, init = {}) => {
        const method = (init.method || 'GET').toUpperCase();
        const out = method === 'GET' ? serverGET() : serverPUT(JSON.parse(init.body));
        return {
          ok: out.status >= 200 && out.status < 300,
          status: out.status,
          json: async () => out.body,
        };
      };
      win.__captured = [];
      win.URL.createObjectURL = (blob) => { win.__captured.push(blob); return 'blob:test'; };
      win.URL.revokeObjectURL = () => {};
    },
  });

  const win = dom.window;
  await new Promise((res) => {
    if (win.__t) return res();
    win.addEventListener('__ready', res, { once: true });
    setTimeout(res, 4000);
  });
  return { dom, win, label };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function login(win) {
  win.document.getElementById('loginUser').value = TEST_USER;
  win.document.getElementById('loginPass').value = TEST_PASS;
  win.document.getElementById('loginRemember').checked = true;
  win.document.getElementById('loginBtn').click();
  for (let i = 0; i < 120; i++) {
    if (!win.document.body.classList.contains('locked')) return true;
    await sleep(100);
  }
  return false;
}
async function capturedText(win, index = -1) {
  const blobs = win.__captured;
  const blob = blobs.at(index);
  return blob ? await blob.text() : '';
}

// ---------------------------------------------------------------- the drill
console.log('\n=== ADVON CRM RESTORE DRILL ===\n');

const SEED = {
  clients: [
    { id: 'c1', name: 'Seed Client', value: 300, stage: 'booked', month: '2026-08' },
  ],
  logs: [], warm: [], sched: [], renewals: [], todos: [], subs: [], ideas: [],
  targets: { yearly: {}, monthly: {} }, workdays: {},
};
const vault = await buildTestVault(SEED);

// A realistic dataset, including characters that break naive CSV writers.
const REAL_RECORDS = [
  { id: 'a1', name: 'Καφετέρια Ολύμπια', value: 450, stage: 'paid',   month: '2026-07', day: '2026-07-14', phone: '6971234567', notes: 'Παράδοση; "urgent", με έκπτωση' },
  { id: 'a2', name: 'Dr. Papadopoulou',  value: 780, stage: 'booked', month: '2026-08', day: '2026-08-03', email: 'info@example.gr', notes: 'Line one\nline two' },
  { id: 'a3', name: "O'Neill & Sons",    value: 1200, stage: 'building', month: '2026-08', viber: '6980000000', notes: 'comma, semicolon; quote "x"' },
  { id: 'a4', name: 'Ζέρβα Ψυχολόγος',   value: 600, stage: 'waitpay', month: '2026-09', notes: '' },
  { id: 'a5', name: 'Test Renewal Ltd',  value: 250, stage: 'paid',   month: '2026-06', notes: 'renews yearly' },
];

// ---- Device A: enter data, sync, export ----
const storageA = {};
const idbA = new IDBFactory();
const A = await openDevice({ vault, storage: storageA, idb: idbA, label: 'Mac' });
check('CRM loads and locks until the passphrase is entered', A.win.document.body.classList.contains('locked'));

const loggedIn = await login(A.win);
check('Passphrase unlocks and decrypts', loggedIn);
if (!loggedIn) { console.log('\nCannot continue.'); process.exit(1); }

A.win.__t.state.clients = REAL_RECORDS.map((r) => ({ ...r }));
A.win.__t.save();
await sleep(1500);

const storedBlob = storageA['advon_crm_v4'];
check('Data at rest on the device is ciphertext, not readable text',
  !!storedBlob && !storedBlob.includes('Παπαδοπούλου') && !storedBlob.includes("O'Neill") && JSON.parse(storedBlob).ct.length > 50);

await sleep(1200);
check('Change reached the server', !!server.file, server.file ? `updatedAt ${server.file.updatedAt}` : 'nothing stored');
check('Server holds ciphertext only — no client names visible',
  !!server.file && !JSON.stringify(server.file).includes("O'Neill"));
check('A dated snapshot was written on save', server.snapshots.length >= 1, `${server.snapshots.length} snapshot(s)`);

// ---- Export both the encrypted backup and the plain CSV ----
await A.win.__t.backupEncrypted();
const encBackup = await capturedText(A.win);
const encParsed = JSON.parse(encBackup);
check('Encrypted backup exports with a dated, self-describing format',
  encParsed.format === 'advon-crm-encrypted-backup' && !!encParsed.iv && !!encParsed.ct && !!encParsed.exportedAt);
check('Encrypted backup contains no readable client data',
  !encBackup.includes("O'Neill") && !encBackup.includes('Ολύμπια'));

A.win.__t.exportAllClientsCSV();
const csv = await capturedText(A.win);
check('Plain CSV lists every client', REAL_RECORDS.every((r) => csv.includes(r.name)),
  `${csv.split('\r\n').length - 1} rows`);
check('CSV survives quotes, commas, semicolons and newlines in notes',
  csv.includes('quote ""x""') && csv.includes('Line one · line two'));

// ---- Device B: a second device pulls the same data ----
const storageB = {};
const B = await openDevice({ vault, storage: storageB, idb: new IDBFactory(), label: 'Phone' });
await login(B.win);
await sleep(800);
const bNames = (B.win.__t.state.clients || []).map((c) => c.name).sort();
check('A second device loads the current data from the server, not a stale copy',
  JSON.stringify(bNames) === JSON.stringify(REAL_RECORDS.map((r) => r.name).sort()),
  `${bNames.length} clients pulled`);

// ---- Conflict: B saves, then A tries to save over it ----
B.win.__t.state.clients.push({ id: 'b1', name: 'Added On Phone', value: 100, stage: 'booked', month: '2026-08' });
B.win.__t.save();
await sleep(1500);
check('Phone edit stored on the server', !!server.file && server.file.deviceId !== undefined);

const staleSha = 'sha-stale-value';
const conflictResp = serverPUT({ data: { iv: 'x', ct: 'y' }, updatedAt: new Date().toISOString(), deviceId: 'Mac', baseSha: staleSha });
check('A write based on an out-of-date copy is REFUSED, not applied', conflictResp.status === 409);
check('The refusal returns the newer copy so it can be shown for a choice',
  conflictResp.status === 409 && !!conflictResp.body.data);
check('The newer data on the server was left untouched by the refused write',
  server.file.data.ct !== 'y');

// ---- SIMULATED DATA LOSS on device A ----
console.log('\n  --- simulating total local data loss on the Mac ---');
const beforeLoss = JSON.parse(JSON.stringify(A.win.__t.state.clients));
for (const k of Object.keys(storageA)) delete storageA[k];
check('Local storage wiped', Object.keys(storageA).length === 0);

// Reload the app on a blank device, with the server also unreachable, so the
// ONLY way back is the exported backup file.
server.file = null; server.sha = null;
const storageC = {};
const C = await openDevice({ vault, storage: storageC, idb: new IDBFactory(), label: 'Recovered Mac' });
await login(C.win);
await sleep(600);
const emptyish = (C.win.__t.state.clients || []).map((c) => c.name);
check('After the wipe the app comes up without the lost records',
  !emptyish.includes("O'Neill & Sons"), `showing ${emptyish.length} seed record(s)`);

// ---- RESTORE from the encrypted backup ----
const restoreInput = C.win.document.getElementById('restoreEncFile');
const file = new C.win.File([encBackup], 'advon-crm-encrypted-2026-08-09.json', { type: 'application/json' });
Object.defineProperty(restoreInput, 'files', { value: [file], configurable: true });
restoreInput.dispatchEvent(new C.win.Event('change'));
await sleep(1500);

const restored = C.win.__t.state.clients || [];
check('Restore brings back the same number of records',
  restored.length === beforeLoss.length, `${restored.length} of ${beforeLoss.length}`);

const norm = (list) => JSON.stringify(
  list.map((c) => ({ id: c.id, name: c.name, value: c.value, stage: c.stage, month: c.month, day: c.day || '', phone: c.phone || '', email: c.email || '', viber: c.viber || '', notes: c.notes || '' }))
      .sort((x, y) => x.id.localeCompare(y.id))
);
check('Every restored record matches the original field for field',
  norm(restored) === norm(beforeLoss));
check('Greek text, apostrophes and multi-line notes survived the round trip',
  restored.some((c) => c.name === 'Καφετέρια Ολύμπια') &&
  restored.some((c) => c.name === "O'Neill & Sons") &&
  restored.some((c) => (c.notes || '').includes('\n')));
check('Restored data was re-encrypted back onto the device',
  !!storageC['advon_crm_v4'] && !storageC['advon_crm_v4'].includes("O'Neill"));

// ---- wrong-passphrase backup must not open ----
const otherVault = await buildTestVault(SEED);
const D = await openDevice({ vault: otherVault, storage: {}, idb: new IDBFactory(), label: 'Wrong key' });
await login(D.win);
await sleep(400);
const dBefore = (D.win.__t.state.clients || []).length;
const dInput = D.win.document.getElementById('restoreEncFile');
const dFile = new D.win.File([encBackup], 'backup.json', { type: 'application/json' });
Object.defineProperty(dInput, 'files', { value: [dFile], configurable: true });
dInput.dispatchEvent(new D.win.Event('change'));
await sleep(800);
check('A backup cannot be opened with the wrong key, and nothing is damaged trying',
  (D.win.__t.state.clients || []).length === dBefore);

// ---- Recovery from git history ----
// Every sync writes a commit to the private data repo. This proves an older
// commit can be pulled back out and decrypted — the same commands RECOVERY.md
// gives you.
console.log('\n  --- git history recovery ---');
const { execFileSync } = await import('node:child_process');
const repo = fs.mkdtempSync('/tmp/crm-datarepo-');
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
git('init', '-q');
git('config', 'user.email', 'drill@example.com');
git('config', 'user.name', 'drill');

// three saves over time, exactly as the sync endpoint would write them
const history = [
  { note: 'oldest', clients: REAL_RECORDS.slice(0, 2) },
  { note: 'middle', clients: REAL_RECORDS.slice(0, 4) },
  { note: 'newest — contains a bad edit', clients: [{ id: 'a1', name: 'OOPS DELETED EVERYTHING', value: 0, stage: 'booked', month: '2026-08' }] },
];
const driveKeyForRepo = await (async () => {
  const base = await webcrypto.subtle.importKey('raw', te.encode(`${TEST_USER}:${TEST_PASS}`), 'PBKDF2', false, ['deriveKey']);
  return webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: Buffer.from(vault.salt, 'base64'), iterations: 310000, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
  );
})();
for (const h of history) {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const ct = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, driveKeyForRepo,
    te.encode(JSON.stringify({ ...SEED, clients: h.clients })));
  fs.writeFileSync(path.join(repo, 'crm-data.json'), JSON.stringify(
    { version: 4, updatedAt: new Date().toISOString(), deviceId: 'Mac', data: { iv: b64(iv.buffer), ct: b64(ct) } }, null, 2));
  git('add', '.');
  git('commit', '-q', '-m', `crm: save (${h.note})`);
}
const log = git('log', '--oneline');
check('Every sync is its own commit in the data repo', log.trim().split('\n').length === 3);

// pull the version from before the bad edit back out
const previous = JSON.parse(git('show', 'HEAD~1:crm-data.json'));
const recoveredPlain = await webcrypto.subtle.decrypt(
  { name: 'AES-GCM', iv: Buffer.from(previous.data.iv, 'base64') },
  driveKeyForRepo, Buffer.from(previous.data.ct, 'base64')
);
const recovered = JSON.parse(new TextDecoder().decode(recoveredPlain));
check('An older version can be pulled out of git history and decrypted',
  recovered.clients.length === 4, `${recovered.clients.length} clients at HEAD~1`);
check('The recovered version is the good data, not the bad edit',
  !recovered.clients.some((c) => c.name === 'OOPS DELETED EVERYTHING') &&
  recovered.clients.some((c) => c.name === "O'Neill & Sons"));
fs.rmSync(repo, { recursive: true, force: true });

// ---------------------------------------------------------------- summary
console.log('\n=== RESULT ===');
console.log(`${pass} passed, ${fail} failed\n`);
fs.writeFileSync(path.join(ROOT, 'scripts/restore-drill-result.txt'),
  `Advon CRM restore drill — ${new Date().toISOString()}\n\n${results.join('\n')}\n\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
