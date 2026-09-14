'use client';
// components/intake/IntakeForm.jsx — the material form for /ylika (rebuilt 14 Sept 2026).
// Three things only: last name, files, a note. Photos are resized in the browser (long edge
// 2400px, JPEG 0.86) so uploads are quick; other documents go as they are up to 4MB. Anything
// bigger, or a whole folder → the optional WeTransfer / Drive link line.
//
// Upload flow (see app/api/intake/route.js): start → one request per file (each becomes a loose
// git blob, no commit) → done (ONE commit with everything). Files never touch a public place.
import { useRef, useState } from 'react';

const MAX_FILES = 40;
const MAX_RAW = 4 * 1024 * 1024;
const IMG_EDGE = 2400;
const IMG_TYPES = /^image\/(jpeg|png|webp|gif|bmp|tiff)$/i;
const DOC_TYPES = /\.(pdf|docx?|txt|rtf|svg|ai|eps|heic|heif|zip|mp4|mov)$/i;

const F = 'w-full bg-[#050a0e]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-cyan transition-colors';

async function resizeImage(file) {
  if (!IMG_TYPES.test(file.type)) return null;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return null;
  const scale = Math.min(1, IMG_EDGE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= 1.4 * 1024 * 1024) { bmp.close(); return null; }
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h); bmp.close();
  const keepPng = /png$/i.test(file.type) && file.size < 2 * 1024 * 1024;
  const blob = await new Promise((r) => canvas.toBlob(r, keepPng ? 'image/png' : 'image/jpeg', 0.86));
  if (!blob) return null;
  const name = keepPng ? file.name : file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: blob.type });
}

const fmtSize = (b) => (b > 1024 * 1024 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

export default function IntakeForm() {
  const [files, setFiles] = useState([]);           // {file, status:'wait'|'up'|'ok'|'err', note, sha, sent}
  const [phase, setPhase] = useState('form');       // form | sending | done
  const [errMsg, setErrMsg] = useState('');
  const [drag, setDrag] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  function addFiles(list) {
    const next = [...files];
    for (const f of Array.from(list || [])) {
      if (next.length >= MAX_FILES) break;
      if (next.some((x) => x.file.name === f.name && x.file.size === f.size)) continue;
      const okType = IMG_TYPES.test(f.type) || DOC_TYPES.test(f.name);
      next.push({ file: f, status: okType ? 'wait' : 'err', note: okType ? '' : 'Δεν υποστηρίζεται αυτός ο τύπος αρχείου' });
    }
    setFiles(next);
  }
  const removeFile = (i) => setFiles(files.filter((_, k) => k !== i));

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    if (fd.get('website_url')) return;                        // honeypot
    const lastName = String(fd.get('lastName') || '').trim();
    const note = String(fd.get('note') || '').trim();
    const transfer = String(fd.get('transfer') || '').trim();
    const good = files.filter((f) => f.status !== 'err');
    if (lastName.length < 2) { setErrMsg('Γράψτε το επώνυμό σας για να ξέρουμε ποιανού είναι το υλικό.'); return; }
    if (!good.length && !transfer && !note) { setErrMsg('Προσθέστε έστω ένα αρχείο, ένα link ή δύο λόγια.'); return; }
    setErrMsg(''); setPhase('sending'); setUploaded(0);
    try {
      const start = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start', lastName, fileCount: good.length }) });
      const s = await start.json();
      if (!start.ok || !s.id) throw new Error(s.error || 'start failed');
      const id = s.id;
      const list = [...files];
      const sent = [];
      let n = 0;
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        if (it.status === 'err') continue;
        list[i] = { ...it, status: 'up' }; setFiles([...list]);
        const f = (await resizeImage(it.file).catch(() => null)) || it.file;
        if (f.size > MAX_RAW) { list[i] = { ...it, status: 'err', note: 'Πάνω από 4MB — στείλτε το με WeTransfer' }; setFiles([...list]); continue; }
        const body = new FormData(); body.append('file', f, f.name); body.append('index', String(i + 1)); body.append('original', it.file.name);
        let res = null;
        for (let attempt = 0; attempt < 3 && !(res && res.ok); attempt++) {
          res = await fetch(`/api/intake?id=${encodeURIComponent(id)}`, { method: 'POST', body }).catch(() => null);
        }
        let out = null; try { out = res && res.ok ? await res.json() : null; } catch {}
        if (out && out.sha) {
          sent.push({ sha: out.sha, name: out.name, original: it.file.name, bytes: out.bytes, type: out.type });
          list[i] = { ...it, status: 'ok', note: '' }; n++; setUploaded(n);
        } else {
          list[i] = { ...it, status: 'err', note: 'Δεν ανέβηκε — δοκιμάστε ξανά ή στείλτε το με WeTransfer' };
        }
        setFiles([...list]);
      }
      if (!sent.length && !transfer && !note) throw new Error('nothing uploaded');
      const done = await fetch(`/api/intake?id=${encodeURIComponent(id)}&done=1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lastName, note, transfer, files: sent, ua: navigator.userAgent, lang: navigator.language }) });
      if (!done.ok) throw new Error('finish failed');
      setPhase('done');
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    } catch (err) {
      setPhase('form'); setErrMsg('Κάτι πήγε στραβά με την αποστολή. Δοκιμάστε ξανά σε λίγο — ή στείλτε το υλικό στο Viber / email που μιλήσαμε.');
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
        <p className="text-white/40 text-sm mt-6">Θυμηθήκατε κάτι ακόμη; Ανοίξτε ξανά αυτή τη σελίδα και στείλτε το — ή στείλτε το στο Viber / email που μιλήσαμε.</p>
      </div>
    );
  }

  const sending = phase === 'sending';
  const good = files.filter((f) => f.status !== 'err').length;
  return (
    <form ref={formRef} onSubmit={submit} className="glass-panel rounded-3xl p-6 md:p-10 space-y-7" noValidate>
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1.5" htmlFor="in-last">Το επώνυμό σας</label>
        <input id="in-last" name="lastName" required autoComplete="family-name" className={F + ' text-lg'} placeholder="π.χ. Παπαδοπούλου" disabled={sending} />
      </div>

      <div>
        <p className="text-sm font-medium text-white/80 mb-1.5">Τα αρχεία σας</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); if (!sending) addFiles(e.dataTransfer.files); }}
          onClick={() => !sending && inputRef.current && inputRef.current.click()}
          className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${drag ? 'border-electric-cyan bg-electric-cyan/10' : 'border-white/15 hover:border-electric-cyan/60 bg-[#050a0e]/40'}`}
          role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current && inputRef.current.click(); } }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 mx-auto mb-3 text-electric-cyan" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <p className="text-white font-semibold">Σύρετε εδώ φωτογραφίες, λογότυπο, PDF, Word — ή πατήστε για να διαλέξετε</p>
          <p className="text-white/45 text-sm mt-1">Όσα αρχεία θέλετε. Οι φωτογραφίες μικραίνουν μόνες τους.</p>
          <input ref={inputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.svg,.ai,.eps,.heic,.heif,.zip,.mp4,.mov" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        </div>
        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {files.map((f, i) => (
              <li key={f.file.name + f.file.size} className="flex items-center gap-3 text-sm bg-white/[0.04] rounded-lg px-3 py-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${f.status === 'ok' ? 'bg-emerald-400' : f.status === 'err' ? 'bg-red-400' : f.status === 'up' ? 'bg-electric-cyan animate-pulse' : 'bg-white/30'}`} />
                <span className="text-white truncate flex-1">{f.file.name}</span>
                <span className="text-white/40 shrink-0">{f.note || fmtSize(f.file.size)}</span>
                {!sending && <button type="button" onClick={() => removeFile(i)} className="text-white/40 hover:text-white shrink-0" aria-label="Αφαίρεση">✕</button>}
              </li>
            ))}
          </ul>
        )}
        {!showLink ? (
          <button type="button" onClick={() => setShowLink(true)} className="mt-3 text-sm text-white/50 hover:text-electric-cyan transition-colors">Έχετε πολλά ή μεγάλα αρχεία; Στείλτε ένα link WeTransfer / Google Drive →</button>
        ) : (
          <input name="transfer" type="url" className={F + ' mt-3'} placeholder="https://we.tl/… ή link Google Drive / Dropbox" disabled={sending} autoFocus />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1.5" htmlFor="in-note">Δύο λόγια από εσάς <span className="text-white/40 font-normal">(προαιρετικό)</span></label>
        <textarea id="in-note" name="note" rows={4} className={F + ' resize-none'} placeholder="Ό,τι θέλετε να ξέρουμε: τι κάνετε, τι σας αρέσει, τι να αποφύγουμε, χρώματα, σελίδες που σας αρέσουν…" disabled={sending} />
      </div>

      {errMsg && <p className="text-red-300 text-sm">{errMsg}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-electric-cyan text-[#050a0e] font-bold px-7 py-3.5 text-base hover:brightness-110 disabled:opacity-60 transition">
          {sending ? `Αποστολή… ${uploaded}/${good}` : 'Αποστολή'}
        </button>
        <p className="text-white/40 text-xs">Το υλικό σας φτάνει μόνο σε εμάς — δεν δημοσιεύεται πουθενά.</p>
      </div>
    </form>
  );
}
