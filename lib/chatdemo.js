// lib/chatdemo.js — the sandbox chat (23 Sept 2026)
//
// A card with `demo:true` («Παράδειγμα (δείγμα)») is Angelo's playground: he opens the client link on his phone or
// desktop, presses the buttons, writes messages — and the server answers AT ONCE the way the real flow would
// days later (first draft delivered, changes done, domain connected), so he can see every stage and every
// message exactly as a client would. The CRM can restart it at any stage (POST ?t=<slug>&reset=1 {stage, dat}).
// Demo chats never e-mail anyone; questions off the button path get no automatic answer — the chat agent drafts a
// reply (suggest) like for a real client and Angelo gets the approval ping.
// The texts below are the CRM's own quick replies (public/crm/index.html CH_*), kept in step by hand.

export const DEMO_SITE = 'https://allsmiles.gr';          // a real Advon site, so «δείτε την ιστοσελίδα σας» opens something
export const DEMO_DOMAIN = 'epitheto-epaggelma.gr';

export const WELCOME = 'Καλώς ήρθατε! 👋\n\nΑυτή είναι η προσωπική σας σελίδα επικοινωνίας με την ομάδα μας για την ιστοσελίδα σας: εδώ μας στέλνετε φωτογραφίες, αλλαγές και ερωτήσεις, κι εδώ σας απαντάμε. Κρατήστε τον σύνδεσμο — είναι δικός σας και δεν αλλάζει.\n\n📊 Πάνω-πάνω βλέπετε πάντα σε ποιο στάδιο βρισκόμαστε και τι χρειαζόμαστε από εσάς σε αυτό το στάδιο. Στόχος μας: να χρειάζεται όσο το δυνατόν λιγότερος χρόνος από τη δική σας πλευρά — εμείς φτιάχνουμε, εσείς ελέγχετε.\n\n👉 Σε κάθε στάδιο υπάρχει ένα κουμπί («Ξεκινήστε την ιστοσελίδα μου», «Έστειλα όλες τις αλλαγές», «Πάμε live»). Πατήστε το όταν τελειώσετε — έτσι ξέρουμε ότι μπορούμε να προχωρήσουμε.';
export const YLIKO_DAT = 'Στάδιο 1 · Υλικό 📷\n\nΤα στοιχεία σας τα αντλούμε από το προφίλ σας στο doctoranytime — δεν χρειάζεται να γράψετε τίποτα.\n\nΧρειαζόμαστε ιδανικά μόνο τις φωτογραφίες σας σε καλή ανάλυση: εσάς, τον χώρο σας και το λογότυπο ή την κάρτα σας, αν υπάρχει. Στείλτε τα εδώ, στη συνομιλία.\n\nΜόλις τις στείλετε, πατήστε «Ξεκινήστε την ιστοσελίδα μου» — το πρώτο draft έρχεται σε 5–10 ημέρες. ⏱️';
export const YLIKO_PLAIN = 'Στάδιο 1 · Υλικό 📷\n\nΣτείλτε μας εδώ ό,τι έχετε εύκολα — τίποτα δεν είναι υποχρεωτικό και τα κείμενα τα γράφουμε εμείς:\n\n1. Φωτογραφίες: εσείς, ο χώρος σας, το λογότυπο αν υπάρχει\n2. Δυο λόγια για εσάς (και σε bullet points)\n3. Οι υπηρεσίες σας\n4. Τηλέφωνο, διεύθυνση, ωράριο\n\nΈχετε προφίλ online (doctoranytime, Google, Facebook); Στείλτε μας τον σύνδεσμο.\n\nΜετά πατήστε «Ξεκινήστε την ιστοσελίδα μου» — το πρώτο draft έρχεται σε 5–10 ημέρες. ⏱️';
export const FIRST_DRAFT = 'Καλησπέρα σας {name},\n\nεργαστήκαμε με τη δική σας ιστοσελίδα και οι 4 μας, και καταφέραμε μόλις να ολοκληρώσουμε την κατασκευή μιας καλής πρώτης εικόνας της ιστοσελίδας σας. Μπορείτε να τη δείτε εδώ:\n{site}\n\nΑνοίξτε την και από υπολογιστή, να δείτε πώς φαίνεται κι εκεί.\n\n✏️ Αν θέλετε οποιαδήποτε αλλαγή — μικρή ή μεγάλη — γράψτε τη μας εδώ, αριθμημένα (1., 2., 3.), όσο πιο συγκεκριμένα γίνεται: οι αλλαγές είναι απεριόριστες μέχρι τη δημοσίευση. Μόλις τις στείλετε όλες, πατήστε «Έστειλα όλες τις αλλαγές» και τις κάνουμε μέσα σε 24 ώρες. Παραδείγματα: [Οδηγός αλλαγών](#odigos)\n\n🚀 Αν είναι ήδη όπως τη θέλετε, πατήστε «Όλα καλά — πάμε live» και γράψτε μας το domain που θα θέλατε (π.χ. epitheto-epaggelma.gr).\n\nΓια τη μεταφορά (για τη φιλοξενία και το domain name μαζί, για 365 ημέρες που μετράνε από τη μέρα που θα ολοκληρώσουμε), που γίνεται κατά την παράδοση του πρώτου draft: αν ΔΕΝ θέλετε απόδειξη-τιμολόγιο μπορείτε να μπείτε εδώ:\nhttps://buy.stripe.com/9B68wP37b6doajUc1Q3cc06\nΑλλιώς θα χρειαστούμε το ΑΦΜ σας και θα προστεθεί ΦΠΑ.\n\nΜόλις γίνει, αγοράζουμε αμέσως και το domain name που θα μας πείτε.\n\nΕυχαριστούμε πολύ!';
export const CHANGES_DONE = 'Καλησπέρα σας {name},\n\nοι αλλαγές σας έγιναν:\n{changes}\n\nΔείτε τα εδώ: {site}\n(Αν δεν φαίνονται αμέσως, κάντε ανανέωση της σελίδας.)\n\nΕλέγξτε, παρακαλώ, όλη την ιστοσελίδα μια φορά — από την αρχή μέχρι το τέλος, και από κινητό — και μετά πατήστε ένα από τα δύο κουμπιά:\n\n✏️ Έχω κι άλλες αλλαγές → γράψτε τις εδώ και πατήστε «Έστειλα όλες τις αλλαγές».\n\n🚀 Όλα καλά → πατήστε «Όλα καλά — πάμε live» και γράψτε μας το domain που θα θέλατε (π.χ. epitheto-epaggelma.gr). Το ελέγχουμε, το αγοράζουμε και η ιστοσελίδα σας είναι online σε 1–2 ημέρες.';
export const DOMAIN_FREE = 'Τέλεια, χαίρομαι πολύ που σας αρέσει! 🎉\n\nΤο {domain} είναι διαθέσιμο — το αγοράζουμε, το συνδέουμε με την ιστοσελίδα σας και σας γράφουμε εδώ μόλις είναι online (1–2 ημέρες).';
export const DOMAIN_LIVE = 'Συνδέθηκε και το domain name με την ιστοσελίδα σας, οπότε μπορείτε πλέον να τη βλέπετε εδώ: {domain}\n\nΘα μας βοηθούσε πάρα πολύ αν μπορούσατε να μας αφήσετε μια πολύ σύντομη αξιολόγηση (αν θέλετε και με το επώνυμο-επάγγελμά σας στο τέλος).\n\nΓια την αξιολόγηση μπορείτε να μπείτε εδώ:\n\nhttps://g.co/kgs/wXBAZWP\n\nΚαι αν έχετε άλλους γνωστούς ελεύθερους επαγγελματίες ή ανθρώπους με μικρές επιχειρήσεις που μπορεί να ενδιαφέρονταν με τις ίδιες συνθήκες, μπορείτε να τους στείλετε τα στοιχεία μου.\n\nΕυχαριστούμε πολύ για την άψογη συνεργασία 🙏\nΣτη διάθεσή σας για ό,τι χρειαστείτε';
export const NUDGE_START = 'Τα έλαβα, ευχαριστώ πολύ! Μόλις στείλετε ό,τι άλλο έχετε (αν έχετε), πατήστε το κουμπί «Ξεκινήστε την ιστοσελίδα μου» — έτσι ξεκινάμε αμέσως και σε 5–10 ημέρες θα έχετε εδώ το πρώτο draft.';
export const NUDGE_CHANGES = 'Τις έλαβα! Αν αυτές είναι όλες οι αλλαγές, πατήστε το κουμπί «Έστειλα όλες τις αλλαγές» και τις κάνω όλες μαζί μέσα σε 24 ώρες. Αν θυμηθείτε κάτι ακόμη, γράψτε το μου πρώτα.';
export const RECEIVED = 'Έλαβα, ευχαριστώ πολύ! Θα το δω και θα σας ενημερώσω μέσα στην ημέρα.';
export const FORM_OK = 'Τέλεια — προσθέτουμε τη Φόρμα Επικοινωνίας στην ιστοσελίδα σας και σας ενημερώνουμε εδώ μόλις είναι έτοιμη.';
// Υλικό: the client sent material and did not press «Ξεκινήστε» → answered by itself (at once in the sandbox, ~10 min later in a
// real chat via netlify/functions/chat-notify.mjs). The two [..](#start) / [..](#more) lines are buttons on the chat page and in the e-mail.
export const ACK_MORE = 'Λάβαμε {what} σας, ευχαριστούμε!\n\nΥπάρχει κάτι άλλο που θα θέλατε να μας στείλετε;\n\n[Όχι — ξεκινήστε την ιστοσελίδα μου](#start)\n[Ναι, θα στείλω κι άλλα](#more)';
// «τη φωτογραφία» / «τις φωτογραφίες» / «το αρχείο» / «τα αρχεία» / «το υλικό» / «το μήνυμα» — from what the client just sent
export function ackWhat(msgs) {
  const files = (msgs || []).flatMap((m) => m.files || []);
  const img = files.filter((f) => /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(f.name || '')).length, doc = files.length - img;
  if (img && doc) return 'το υλικό';
  if (img) return img === 1 ? 'τη φωτογραφία' : 'τις φωτογραφίες';
  if (doc) return doc === 1 ? 'το αρχείο' : 'τα αρχεία';
  return 'το μήνυμα';
}
// Angelo's saved wording (chats/templates.json → t) wins over the default text here
export const tpl = (T, key, def) => (T && typeof T[key] === 'string' && T[key].trim() ? T[key] : def);
export const ackText = (T, msgs) => tpl(T, 'ack_more', ACK_MORE).replace(/\{what\}/g, ackWhat(msgs));

// no longer sent (Angelo, 23 Sept 2026 — he knows it is the test chat)
export const DEMO_NOTE = '🧪 Αυτή είναι η δοκιμαστική συνομιλία: απαντά αμέσως, όπως θα απαντούσαμε εμείς στην πραγματικότητα μετά από μερικές ημέρες. Πατήστε τα κουμπιά, γράψτε μηνύματα, δείτε πώς φαίνεται κάθε στάδιο.';

const fill = (s, t, extra = {}) => s.replace(/\{name\}/g, (t.name || '').trim()).replace(/\{site\}/g, extra.site || t.site || DEMO_SITE).replace(/\{domain\}/g, extra.domain || DEMO_DOMAIN).replace(/\{changes\}/g, extra.changes || '');

// the messages a fresh (or restarted) demo thread opens with, per stage
export function demoSeed(stage, t, dat, T) {
  const s = stage === 'payment' ? 'changes' : stage;
  const W = tpl(T, 'welcome', WELCOME);
  if (s === 'draft') return [W, fill(tpl(T, 'q:First draft · plain (hosting + domain)', FIRST_DRAFT), t)];
  if (s === 'changes') return [W, fill(CHANGES_DONE, t, { changes: '1. Η φωτογραφία στην αρχή άλλαξε με τη νέα\n2. Το τηλέφωνο διορθώθηκε στην επικοινωνία και στο υποσέλιδο\n3. Το κείμενο «Λίγα λόγια για εμένα» ενημερώθηκε' })];
  if (s === 'live') return [W, fill(tpl(T, 'q:Domain connected · review ask', DOMAIN_LIVE), t, { domain: 'https://' + DEMO_DOMAIN })];
  return [W, dat ? tpl(T, 'yliko_dat', YLIKO_DAT) : tpl(T, 'yliko_plain', YLIKO_PLAIN)];
}

// «is this a question / something off the button path?» — a question mark, or a typical Greek question opening
export const isQuestion = (text) => /[?;]\s*$|[?;]\s*\n/.test(String(text || '').trim() + '\n') || /^(πόσο|πότε|πώς|γιατί|τι |μπορ|θα ήθελα να ρωτήσω|έχω (μια )?ερώτηση|ερώτηση)/i.test(String(text || '').trim());

// what the sandbox answers to a client message: [{text, stage?, site?, clearReady?}] — sent as Angelo a second later
export function demoReply(t, msg, T) {
  const stage = t.stage === 'payment' ? 'changes' : t.stage || 'yliko';
  const kind = String(msg.kind || '').replace(/^ready:/, '');
  const text = String(msg.text || '');
  if (kind === 'build') return [{ text: fill(tpl(T, 'q:First draft · plain (hosting + domain)', FIRST_DRAFT), t, { site: DEMO_SITE }), stage: 'draft', site: DEMO_SITE, clearReady: true }];
  if (kind === 'changes') {
    // turn whatever they wrote earlier into a «done» list — the numbered lines of their last messages, or a generic one
    const lines = (msg.context || []).flatMap((m) => String(m.text || '').split('\n')).map((l) => l.trim()).filter((l) => /^\d+[.)]\s*\S/.test(l)).slice(0, 8);
    const changes = lines.length ? lines.map((l, i) => `${i + 1}. ${l.replace(/^\d+[.)]\s*/, '')} ✓`).join('\n') : '1. Όλες οι αλλαγές που μας γράψατε έγιναν ✓';
    return [{ text: fill(CHANGES_DONE, t, { site: DEMO_SITE, changes }), stage: 'changes', clearReady: true }];
  }
  if (kind === 'live') {
    const dm = text.match(/Domain[^:]*:\s*([a-z0-9.-]+\.[a-z]{2,})/i);
    const domain = dm ? dm[1] : DEMO_DOMAIN;
    // like the real flow: the client hears the domain is free; Angelo gets «buy the domain» in Do ASAP and presses
    // «🌐 Domain connected» in the CRM himself, which sends the review message
    return [{ text: fill(tpl(T, 'domain_free', DOMAIN_FREE), t, { domain }), clearReady: true }];
  }
  if (/φόρμα επικοινωνίας/i.test(text)) return [{ text: FORM_OK }];
  // off the path (a question, anything that is not material or a list of changes): no automatic answer —
  // Claude prepares a DRAFT reply at the next check and Angelo sends it from the CRM (like a real client)
  if (isQuestion(text) && !(msg.files && msg.files.length)) return [];
  // Υλικό without «Ξεκινήστε»: «Λάβαμε … Υπάρχει κάτι άλλο;» with the two buttons (Angelo, 25 Sept 2026)
  if (stage === 'yliko') return t.ready ? [] : [{ text: ackText(T, [msg]) }];
  if ((stage === 'draft' || stage === 'changes') && /(^|\n)\s*\d+[.)]\s*\S/.test(text)) return [{ text: tpl(T, 'q:Nudge · press «Έστειλα όλες τις αλλαγές»', NUDGE_CHANGES) }];
  if (stage === 'draft' || stage === 'changes') return [];
  return [];
}
