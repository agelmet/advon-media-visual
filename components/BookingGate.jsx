// components/BookingGate.jsx — the e-mail code before the booking calendar (20 Oct 2026)
//
// Shown inside the white calendar box of the contact section. Step 1: e-mail → «Συνέχεια» (POST /api/verify
// send). Step 2: the 6-digit code from the e-mail (POST /api/verify check). A correct code is remembered for
// 30 days in localStorage (`advon-bk`: {email, verified}) so a returning visitor goes straight to the calendar.
// Storage is a convenience only: every read/write is wrapped, and without it the visitor simply confirms again.
'use client';
import { useEffect, useRef, useState } from 'react';

const LS = 'advon-bk';
const readLS = () => { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch { return null; } };
const writeLS = (v) => { try { localStorage.setItem(LS, JSON.stringify(v)); } catch {} };

const T = {
  el: {
    title: 'Δείτε τις διαθέσιμες ώρες',
    lead: 'Γράψτε το email σας και θα σας στείλουμε έναν 6ψήφιο κωδικό — έτσι ξέρουμε ότι το ραντεβού το κλείνετε εσείς.',
    email: 'Το email σας', go: 'Συνέχεια', sending: 'Αποστολή…',
    sent: (e) => <>Στείλαμε τον κωδικό στο <b className="text-[#050608]">{e}</b>.</>,
    spam: 'Δεν τον βλέπετε; Κοιτάξτε και στα «Ανεπιθύμητα» ή στις «Προωθήσεις».',
    code: 'Κωδικός 6 ψηφίων', check: 'Επιβεβαίωση', checking: 'Έλεγχος…',
    again: 'Ξαναστείλτε τον κωδικό', againIn: (s) => `Ξαναστείλτε σε ${s}″`, change: 'Αλλαγή email',
    fine: 'Το email σας χρησιμοποιείται μόνο για το ραντεβού σας.',
    errEmail: 'Ελέγξτε το email — χρειαζόμαστε μια έγκυρη διεύθυνση.',
    errWrong: 'Ο κωδικός δεν είναι σωστός. Δοκιμάστε ξανά.',
    errExpired: 'Ο κωδικός έληξε. Πατήστε «Ξαναστείλτε τον κωδικό».',
    errMany: 'Πολλές προσπάθειες. Δοκιμάστε ξανά σε λίγα λεπτά.',
    errSend: 'Δεν μπορέσαμε να στείλουμε τον κωδικό. Δοκιμάστε ξανά ή γράψτε μας στο angelos@advonmedia.com.',
  },
  en: {
    title: 'See the available times',
    lead: "Type your email and we'll send you a 6-digit code — that way we know the booking is really yours.",
    email: 'Your email', go: 'Continue', sending: 'Sending…',
    sent: (e) => <>We sent the code to <b className="text-[#050608]">{e}</b>.</>,
    spam: "Can't see it? Check your Spam or Promotions folder too.",
    code: '6-digit code', check: 'Confirm', checking: 'Checking…',
    again: 'Send the code again', againIn: (s) => `Send again in ${s}s`, change: 'Change email',
    fine: 'Your email is used only for your appointment.',
    errEmail: 'Please check your email — we need a valid address.',
    errWrong: "That code isn't right. Please try again.",
    errExpired: 'The code has expired. Tap «Send the code again».',
    errMany: 'Too many attempts. Please try again in a few minutes.',
    errSend: "We couldn't send the code. Please try again or email us at angelos@advonmedia.com.",
  },
};

async function call(body) {
  const r = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  let j = {}; try { j = await r.json(); } catch {}
  return { status: r.status, ...j };
}

export default function BookingGate({ lang = 'el', onVerified }) {
  const t = T[lang === 'en' ? 'en' : 'el'];
  const [phase, setPhase] = useState('boot');      // boot → email → code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [wait, setWait] = useState(0);
  const codeRef = useRef(null);
  const doneRef = useRef(false);

  const finish = (e) => { if (doneRef.current) return; doneRef.current = true; onVerified && onVerified(e); };

  // A visitor who confirmed in the last 30 days goes straight to the calendar.
  useEffect(() => {
    const saved = readLS();
    if (saved && saved.verified) {
      call({ action: 'known', verified: saved.verified })
        .then((r) => { if (r.ok) finish(r.email); else { setEmail(saved.email || ''); setPhase('email'); } })
        .catch(() => { setEmail(saved.email || ''); setPhase('email'); });
    } else setPhase('email');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  useEffect(() => { if (phase === 'code') setTimeout(() => codeRef.current && codeRef.current.focus(), 60); }, [phase]);

  const send = async (e) => {
    if (e) e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setErr(t.errEmail); return; }
    setBusy(true); setErr('');
    try {
      const r = await call({ action: 'send', email: v, lang });
      if (r.ok) { setToken(r.token); setCode(''); setPhase('code'); setWait(30); }
      else setErr(r.error === 'bad_email' ? t.errEmail : r.error === 'too_many' ? t.errMany : t.errSend);
    } catch { setErr(t.errSend); }
    setBusy(false);
  };

  const check = async (val) => {
    const c = String(val ?? code).replace(/\D/g, '');
    if (c.length !== 6 || busy) return;
    setBusy(true); setErr('');
    try {
      const r = await call({ action: 'check', token, code: c });
      if (r.ok) { writeLS({ email: r.email, verified: r.verified }); finish(r.email); return; }
      setErr(r.error === 'expired' ? t.errExpired : r.error === 'too_many' ? t.errMany : t.errWrong);
      setCode('');
    } catch { setErr(t.errSend); }
    setBusy(false);
  };

  const field = 'w-full rounded-xl border border-[#d9dde3] bg-white px-4 py-3.5 text-[#050608] placeholder:text-[#9aa1ad] focus:outline-none focus:border-[#1aa9e6] focus:shadow-[0_0_0_3px_rgba(26,169,230,0.18)] transition-[border-color,box-shadow] duration-200';
  const btn = 'w-full rounded-xl bg-[#050608] px-4 py-3.5 font-black uppercase tracking-widest text-white text-sm transition-[background-color,transform] duration-200 hover:bg-[#13202a] active:scale-[0.99] disabled:opacity-60';

  if (phase === 'boot') return <div className="absolute inset-0 grid place-items-center bg-white"><span className="bk-spin" aria-hidden="true" /></div>;

  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-white px-6 py-8 text-left bk-gate">
      <div className="w-full max-w-[360px]">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf7fd] text-[#1a8fc4]" aria-hidden="true">
          {phase === 'email'
            ? <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
            : <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
        </div>
        <h4 className="text-center text-xl font-black text-[#050608]">{t.title}</h4>

        {phase === 'email' && (
          <form onSubmit={send} noValidate className="mt-3">
            <p className="mb-5 text-center text-sm leading-relaxed text-[#5b616e]">{t.lead}</p>
            <label htmlFor="bk-email" className="sr-only">{t.email}</label>
            <input id="bk-email" type="email" inputMode="email" autoComplete="email" required placeholder={t.email}
              value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
            <button type="submit" disabled={busy} className={`${btn} mt-3`}>{busy ? t.sending : t.go}</button>
          </form>
        )}

        {phase === 'code' && (
          <form onSubmit={(e) => { e.preventDefault(); check(); }} noValidate className="mt-3">
            <p className="mb-1 text-center text-sm leading-relaxed text-[#5b616e]">{t.sent(email.trim())}</p>
            <p className="mb-5 text-center text-xs leading-relaxed text-[#8a909c]">{t.spam}</p>
            <label htmlFor="bk-code" className="sr-only">{t.code}</label>
            <input id="bk-code" ref={codeRef} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" maxLength={6}
              placeholder="••••••" value={code}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setCode(v); if (v.length === 6) check(v); }}
              className={`${field} text-center text-2xl font-black tracking-[0.5em] placeholder:tracking-[0.5em]`} />
            <button type="submit" disabled={busy || code.length !== 6} className={`${btn} mt-3`}>{busy ? t.checking : t.check}</button>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold">
              <button type="button" className="text-[#5b616e] underline-offset-4 hover:underline" onClick={() => { setPhase('email'); setErr(''); setCode(''); }}>{t.change}</button>
              <button type="button" disabled={wait > 0 || busy} className="text-[#1a8fc4] underline-offset-4 hover:underline disabled:text-[#9aa1ad] disabled:no-underline" onClick={() => send()}>
                {wait > 0 ? t.againIn(wait) : t.again}
              </button>
            </div>
          </form>
        )}

        {err && <p role="alert" className="mt-4 rounded-lg bg-[#fff1f0] px-3 py-2 text-center text-sm font-bold text-[#b42318]">{err}</p>}
        <p className="mt-5 text-center text-[11px] leading-relaxed text-[#8a909c]">{t.fine}</p>
      </div>
    </div>
  );
}
