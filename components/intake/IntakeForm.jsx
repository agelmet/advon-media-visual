'use client';
// components/intake/IntakeForm.jsx — the client-facing material form for /ylika.
// Photos are resized in the browser (long edge 2400px, JPEG 0.86) so uploads are quick and
// every file fits the API limit; other documents go as they are up to 4MB. Anything bigger
// or a whole folder → the WeTransfer / Drive link field.
import { useRef, useState } from 'react';

const MAX_FILES = 40;
const MAX_RAW = 4 * 1024 * 1024;         // non-image files sent as they are
const IMG_EDGE = 2400;                   // long edge after resize
const IMG_TYPES = /^image\/(jpeg|png|webp|gif|bmp|tiff)$/i;
const DOC_TYPES = /\.(pdf|docx?|txt|rtf|svg|ai|eps|heic|heif|zip)$/i;

const F = 'w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-cyan transition-colors';
const L = 'block text-sm font-medium text-white/80 mb-1.5';

const SPECS = ['Ψυχολόγος', 'Ψυχοθεραπευτής', 'Οδοντίατρος', 'Παιδίατρος', 'Παθολόγος', 'Φυσικοθεραπευτής', 'Διαιτολόγος', 'Λογοθεραπευτής', 'Δικηγόρος', 'Λογιστής', 'Κομμωτήριο / Beauty', 'Εστίαση', 'Άλλο'];

function slugify(s) {
  const map = { α: 'a', ά: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z', η: 'i', ή: 'i', θ: 'th', ι: 'i', ί: 'i', ϊ: 'i', ΐ: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'o' };
  return String(s || '').toLowerCase().split('').map((c) => map[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'client';
}

async function resizeImage(file) {
  if (!IMG_TYPES.test(file.type)) return null;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return null;
  const scale = Math.min(1, IMG_EDGE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= 1.4 * 1024 * 1024) { bmp.close(); return null; }   // small enough as it is
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h); bmp.close();
  const keepPng = /png$/i.test(file.type) && file.size < 2 * 1024 * 1024;   // logos with transparency stay PNG
  const blob = await new Promise((r) => canvas.toBlob(r, keepPng ? 'image/png' : 'image/jpeg', 0.86));
  if (!blob) return null;
  const name = keepPng ? file.name : file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: blob.type });
}

export default function IntakeForm() {
  const [files, setFiles] = useState([]);           // {file, status:'wait'|'up'|'ok'|'err', pct}
  const [phase, setPhase] = useState('form');       // form | sending | done | error
  const [errMsg, setErrMsg] = useState('');
  const [drag, setDrag] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  function addFiles(list) {
    const next = [...files];
    for (const f of Array.from(list || [])) {
      if (next.length >= MAX_FILES) break;
      if (next.some((x) => x.file.name === f.name && x.file.size === f.size)) continue;
      const okType = IMG_TYPES.test(f.type) || DOC_TYPES.test(f.name);
      next.push({ file: f, status: okType ? 'wait' : 'err', pct: 0, note: okType ? '' : 'Μη υποστηριζόμενος τύπος' });
    }
    setFiles(next);
  }
  const removeFile = (i) => setFiles(files.filter((_, k) => k !== i));

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    if (fd.get('website_url')) return;                        // honeypot
    const meta = Object.fromEntries(['lastName', 'firstName', 'spec', 'specOther', 'phone', 'email', 'city', 'address', 'links', 'instructions', 'transfer', 'pages'].map((k) => [k, String(fd.get(k) || '').trim()]));
    if (!meta.lastName || !meta.phone || !meta.spec) { setErrMsg('Χρειαζόμαστε τουλάχιστον το επώνυμο, την ειδικότητα και ένα τηλέφωνο.'); return; }
    if (!files.length && !meta.transfer) { setErrMsg('Προσθέστε τουλάχιστον μία φωτογραφία ή ένα link WeTransfer / Drive — ή γράψτε «χωρίς υλικό» στις οδηγίες.'); if (!/χωρ[ίι]ς\s+υλικ/i.test(meta.instructions)) return; }
    setErrMsg(''); setPhase('sending'); setUploaded(0);
    try {
      const start = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start', meta, slug: slugify(meta.lastName), fileCount: files.filter((f) => f.status !== 'err').length, ua: navigator.userAgent, lang: navigator.language }) });
      const s = await start.json();
      if (!start.ok || !s.id) throw new Error(s.error || 'start failed');
      const id = s.id;
      let n = 0;
      const list = [...files];
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        if (it.status === 'err') continue;
        list[i] = { ...it, status: 'up' }; setFiles([...list]);
        let f = (await resizeImage(it.file).catch(() => null)) || it.file;
        if (f.size > MAX_RAW) { list[i] = { ...it, status: 'err', note: 'Πάνω από 4MB — στείλτε το με WeTransfer' }; setFiles([...list]); continue; }
        const body = new FormData(); body.append('file', f, f.name); body.append('index', String(i + 1)); body.append('original', it.file.name);
        let ok = false;
        for (let attempt = 0; attempt < 2 && !ok; attempt++) {
          const r = await fetch(`/api/intake?id=${encodeURIComponent(id)}`, { method: 'POST', body }).catch(() => null);
          ok = !!(r && r.ok);
        }
        list[i] = { ...it, status: ok ? 'ok' : 'err', note: ok ? '' : 'Δεν ανέβηκε — στείλτε το με WeTransfer' };
        if (ok) { n++; setUploaded(n); }
        setFiles([...list]);
      }
      const done = await fetch(`/api/intake?id=${encodeURIComponent(id)}&done=1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uploaded: n, failed: list.filter((x) => x.status === 'err').map((x) => x.file.name) }) });
      if (!done.ok) throw new Error('finish failed');
      setPhase('done');
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    } catch (err) {
      setPhase('error'); setErrMsg('Κάτι πήγε στραβά με την αποστολή. Δοκιμάστε ξανά σε λίγο — ή στείλτε το υλικό στο Viber / email μας.');
    }
  }

  if (phase === 'done') {
    return (
      <div className="glass-panel rounded-3xl p-8 md:p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-electric-cyan/15 text-electric-cyan grid place-items-center mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="font-display text-white text-3xl md:text-4xl mb-3">Το λάβαμε. Ευχαριστούμε!</h2>
        <p className="text-white/70 text-lg max-w-[34rem] mx-auto">Ξεκινάμε τη σελίδα σας. Θα λάβετε το πρώτο δείγμα μέσα σε 2–3 εργάσιμες ημέρες, με link για να το δείτε από το κινητό σας.{uploaded ? ` Ανέβηκαν ${uploaded} αρχεία.` : ''}</p>
        <p className="text-white/40 text-sm mt-6">Θυμηθήκατε κάτι ακόμη; Στείλτε το απλά στο Viber ή στο email που μιλήσαμε.</p>
      </div>
    );
  }

  const sending = phase === 'sending';
  return (
    <form ref={formRef} onSubmit={submit} className="glass-panel rounded-3xl p-6 md:p-10 space-y-8" noValidate>
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset className="space-y-4">
        <legend className="font-display text-white text-2xl mb-3">1 · Τα στοιχεία σας</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={L} htmlFor="in-last">Επώνυμο <span className="text-electric-cyan">*</span></label><input id="in-last" name="lastName" required className={F} placeholder="π.χ. Παπαδοπούλου" /></div>
          <div><label className={L} htmlFor="in-first">Όνομα</label><input id="in-first" name="firstName" className={F} placeholder="π.χ. Μαρία" /></div>
          <div>
            <label className={L} htmlFor="in-spec">Ειδικότητα / επάγγελμα <span className="text-electric-cyan">*</span></label>
            <select id="in-spec" name="spec" required className={F} defaultValue="">
              <option value="" disabled>Επιλέξτε…</option>
              {SPECS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className={L} htmlFor="in-specOther">Αν «Άλλο» — τι ακριβώς;</label><input id="in-specOther" name="specOther" className={F} placeholder="π.χ. Ορθοπαιδικός, Αρχιτέκτονας" /></div>
          <div><label className={L} htmlFor="in-phone">Τηλέφωνο για τη σελίδα <span className="text-electric-cyan">*</span></label><input id="in-phone" name="phone" type="tel" required className={F} placeholder="π.χ. 210 1234567" /></div>
          <div><label className={L} htmlFor="in-email">Email για τη σελίδα</label><input id="in-email" name="email" type="email" className={F} placeholder="π.χ. info@…" /></div>
          <div><label className={L} htmlFor="in-city">Πόλη / περιοχή</label><input id="in-city" name="city" className={F} placeholder="π.χ. Καλαμάτα" /></div>
          <div><label className={L} htmlFor="in-address">Διεύθυνση ιατρείου / γραφείου</label><input id="in-address" name="address" className={F} placeholder="π.χ. Ναυαρίνου 12" /></div>
        </div>
        <div>
          <label className={L} htmlFor="in-links">Links που έχετε ήδη (doctoranytime, Google, Instagram, Facebook, παλιά σελίδα)</label>
          <textarea id="in-links" name="links" rows={2} className={F + ' resize-none'} placeholder="Ένα link ανά γραμμή — από εκεί παίρνουμε βιογραφικό, υπηρεσίες και αξιολογήσεις" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-white text-2xl mb-1">2 · Φωτογραφίες, λογότυπο, κείμενα</legend>
        <p className="text-white/55 text-sm">Φωτογραφίες του χώρου και δικές σας, λογότυπο αν υπάρχει, κείμενα ή βιογραφικό σε Word/PDF. Οι φωτογραφίες μικραίνουν αυτόματα — δεν χρειάζεται να κάνετε τίποτα.</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current && inputRef.current.click()}
          className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${drag ? 'border-electric-cyan bg-electric-cyan/10' : 'border-white/15 hover:border-electric-cyan/60 bg-[#050a0e]/40'}`}
          role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current && inputRef.current.click(); } }}
        >
          <input ref={inputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.svg,.ai,.eps,.heic,.heif,.zip" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mx-auto text-electric-cyan mb-3" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <p className="text-white font-semibold">Πατήστε εδώ ή σύρετε τα αρχεία</p>
          <p className="text-white/50 text-sm mt-1">Από το κινητό: επιλέξτε πολλές φωτογραφίες μαζί. Έως {MAX_FILES} αρχεία.</p>
        </div>
        {files.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-2">
            {files.map((it, i) => (
              <li key={it.file.name + it.file.size} className="flex items-center gap-3 bg-[#050a0e]/50 border border-white/10 rounded-xl px-3 py-2 text-sm">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${it.status === 'ok' ? 'bg-emerald-400' : it.status === 'err' ? 'bg-rose-400' : it.status === 'up' ? 'bg-electric-cyan animate-pulse' : 'bg-white/30'}`} aria-hidden="true" />
                <span className="text-white/85 truncate flex-1">{it.file.name}</span>
                <span className="text-white/40 text-xs shrink-0">{it.note || (it.file.size > 1048576 ? (it.file.size / 1048576).toFixed(1) + ' MB' : Math.round(it.file.size / 1024) + ' KB')}</span>
                {!sending && <button type="button" onClick={() => removeFile(i)} className="text-white/40 hover:text-white px-1" aria-label="Αφαίρεση">×</button>}
              </li>
            ))}
          </ul>
        )}
        <div>
          <label className={L} htmlFor="in-transfer">Πολλά ή μεγάλα αρχεία; Επικολλήστε ένα link WeTransfer / Google Drive / Dropbox</label>
          <input id="in-transfer" name="transfer" className={F} placeholder="https://we.tl/… ή https://drive.google.com/…" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-white text-2xl mb-1">3 · Οδηγίες (προαιρετικά)</legend>
        <div>
          <label className={L} htmlFor="in-instr">Τι θέλετε να προσέξουμε;</label>
          <textarea id="in-instr" name="instructions" rows={4} className={F + ' resize-none'} placeholder="Χρώματα που σας αρέσουν, ύφος (ζεστό / αυστηρό / μοντέρνο), υπηρεσίες που θέλετε να ξεχωρίζουν, ωράριο, σελίδες συναδέλφων που σας αρέσουν…" />
        </div>
        <div>
          <label className={L} htmlFor="in-pages">Θέλετε και αγγλική έκδοση; Online ραντεβού;</label>
          <input id="in-pages" name="pages" className={F} placeholder="π.χ. Ναι αγγλικά · ραντεβού μέσω doctoranytime" />
        </div>
      </fieldset>

      {errMsg && <p className="text-rose-300 text-sm bg-rose-500/10 border border-rose-400/30 rounded-xl px-4 py-3">{errMsg}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" disabled={sending} className="btn-premium inline-flex items-center justify-center gap-2 bg-electric-cyan text-[#050a0e] font-bold rounded-xl px-8 py-4 text-base disabled:opacity-60">
          {sending ? `Αποστολή… ${uploaded}/${files.filter((f) => f.status !== 'err').length || 0} αρχεία` : 'Αποστολή υλικού'}
        </button>
        <p className="text-white/45 text-xs sm:max-w-[26rem]">Τα αρχεία σας μένουν ιδιωτικά, μόνο για την κατασκευή της σελίδας σας. Μπορείτε να στείλετε κι άλλα αργότερα.</p>
      </div>
    </form>
  );
}
