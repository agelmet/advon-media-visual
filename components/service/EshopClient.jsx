// components/service/EshopClient.jsx
// «Κατασκευή E-shop» (24 Nov 2026). Two ways, one shop:
//   A · orders arrive by e-mail (cash on delivery / transfer), build 0€, 180€ + ΦΠΑ a year — recommended to start;
//   B · card payments through the owner's own Stripe account, 350€ + ΦΠΑ build, 240€ + ΦΠΑ a year.
// Signature: a drawn shop + the order e-mail the owner receives, which changes with the A/B switch.
// Everything is CSS/SVG — no images, nothing loaded from outside.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { FaqSection, StepsSection } from '@/components/service/blocks';
import { Head, Chips, PriceCard, useLang } from '@/components/service/setup';

const T = {
  el: {
    label: 'Κατασκευή E-shop',
    h1a: 'Το κατάστημά σας online.', h1b: 'Από 0€.',
    chips: ['Κατασκευή 0€', 'Προϊόντα & τιμές τα αλλάζετε εσείς', 'Παραγγελίες στο email σας', 'Και με κάρτα, όποτε θέλετε'],
    cta1: 'Θέλω e-shop', cta2: 'Δείτε τις δύο επιλογές',
    shopName: 'Το κατάστημά σας', cart: 'Καλάθι', add: 'Στο καλάθι',
    products: [['Κερί σόγιας 200g', '14,90€', 'a'], ['Σαπούνι ελαιολάδου', '6,50€', 'b'], ['Μέλι θυμαρίσιο 450g', '9,80€', 'c'], ['Κεραμική κούπα', '12,00€', 'd']],
    send: 'Αποστολή παραγγελίας',
    illu: 'Ενδεικτική απεικόνιση',

    oLabel: 'Οι δύο επιλογές', oTitle: 'Ίδιο κατάστημα. Διαλέγετε πώς πληρώνει ο πελάτης.',
    oLead: 'Και στις δύο φτιάχνουμε εμείς όλο το κατάστημα και ανεβάζουμε τα προϊόντα σας. Η μόνη διαφορά: αν ο πελάτης πληρώνει online με κάρτα ή αργότερα, όταν του τηλεφωνήσετε.',
    a: ['E-shop με παραγγελία στο email', '0€', 'κατασκευή', '180€ + ΦΠΑ τον χρόνο · φιλοξενία, domain και πίνακας διαχείρισης', [
      'Ολοκληρωμένο κατάστημα: κατηγορίες, φωτογραφίες, τιμές, καλάθι',
      'Ο πελάτης στέλνει την παραγγελία με ένα κουμπί — έρχεται στο email σας',
      'Πληρωμή με αντικαταβολή, με κατάθεση ή στο κατάστημα — όπως ορίσετε',
      'Εσείς τον καλείτε, επιβεβαιώνετε και στέλνετε με courier',
      'Πίνακας διαχείρισης: προσθέτετε προϊόντα και αλλάζετε τιμές μόνοι σας',
      'Καμία σύνδεση με τράπεζα, καμία προμήθεια ανά παραγγελία',
    ], 'Η πρότασή μας για αρχή'],
    b: ['E-shop με πληρωμή με κάρτα', '350€', '+ ΦΠΑ κατασκευή, μία φορά', '240€ + ΦΠΑ τον χρόνο · συντήρηση, φιλοξενία, domain', [
      'Όλα όσα έχει το πρώτο',
      'Ο πελάτης πληρώνει με κάρτα τη στιγμή της παραγγελίας',
      'Τα χρήματα πάνε απευθείας στον τραπεζικό σας λογαριασμό — εμείς δεν τα αγγίζουμε ποτέ',
      'Η Stripe κρατά μια μικρή προμήθεια ανά παραγγελία (περίπου 1,5% + 0,25€)',
      'Εσείς ανοίγετε μόνο τον λογαριασμό σας στη Stripe — τα υπόλοιπα τα συνδέουμε εμείς',
      'Η παραγγελία έρχεται στο email σας ήδη πληρωμένη',
    ]],
    ctaA: 'Ξεκινάω με αυτό', ctaB: 'Θέλω πληρωμή με κάρτα',
    vat: 'Όλες οι τιμές είναι χωρίς ΦΠΑ 24%. Μπορείτε να ξεκινήσετε με το πρώτο και να προσθέσουμε την κάρτα αργότερα, στο ίδιο κατάστημα.',

    fLabel: 'Μια παραγγελία, βήμα βήμα', fTitle: 'Τι γίνεται όταν κάποιος αγοράζει.',
    tabA: 'Παραγγελία στο email', tabB: 'Πληρωμή με κάρτα',
    flowA: [
      ['Ο πελάτης διαλέγει', 'Βάζει τα προϊόντα στο καλάθι, όπως σε κάθε e-shop.'],
      ['Στέλνει την παραγγελία', 'Γράφει όνομα, τηλέφωνο, διεύθυνση και διαλέγει τρόπο πληρωμής — π.χ. αντικαταβολή.'],
      ['Έρχεται στο email σας', 'Με όλα τα στοιχεία: τι πήρε, πόσα, σύνολο, πού μένει.'],
      ['Τον καλείτε και στέλνετε', 'Επιβεβαιώνετε, τυλίγετε, στέλνετε με το courier σας. Πληρώνει όταν παραλάβει.'],
    ],
    flowB: [
      ['Ο πελάτης διαλέγει', 'Βάζει τα προϊόντα στο καλάθι, όπως σε κάθε e-shop.'],
      ['Πληρώνει με κάρτα', 'Σε ασφαλή σελίδα πληρωμής. Τα στοιχεία της κάρτας δεν περνούν ποτέ από εμάς ή από εσάς.'],
      ['Έρχεται στο email σας, πληρωμένη', 'Τα χρήματα πάνε στον λογαριασμό σας στη Stripe και από εκεί στην τράπεζά σας.'],
      ['Στέλνετε', 'Τυλίγετε και στέλνετε με το courier σας. Χωρίς τηλέφωνα, χωρίς αντικαταβολή.'],
    ],
    mail: { inbox: 'Εισερχόμενα', subj: 'Νέα παραγγελία #1042', from: 'Το κατάστημά σας', now: 'μόλις τώρα', cust: 'Πελάτης', custV: 'Μαρία Κ. · 69•• ••• •••', addr: 'Διεύθυνση', addrV: 'Τσιμισκή ••, Θεσσαλονίκη', lines: [['2 × Κερί σόγιας 200g', '29,80€'], ['1 × Μέλι θυμαρίσιο 450g', '9,80€']], total: 'Σύνολο', totalV: '39,60€', pay: 'Πληρωμή', payA: 'Αντικαταβολή', payB: 'Πληρώθηκε με κάρτα ✓', nextA: 'Επόμενο βήμα: καλείτε τη Μαρία, επιβεβαιώνετε και στέλνετε.', nextB: 'Η πληρωμή έγινε. Επόμενο βήμα: στέλνετε.' },

    cmpLabel: 'Ποιο σας ταιριάζει', cmpTitle: 'Οι δύο επιλογές, δίπλα δίπλα.',
    cmpHead: ['', 'Παραγγελία στο email', 'Πληρωμή με κάρτα'],
    cmp: [
      ['Κατασκευή', '0€', '350€ + ΦΠΑ, μία φορά'],
      ['Κάθε χρόνο', '180€ + ΦΠΑ', '240€ + ΦΠΑ'],
      ['Πώς πληρώνει ο πελάτης', 'Αντικαταβολή, κατάθεση ή στο κατάστημα', 'Με κάρτα, τη στιγμή της παραγγελίας'],
      ['Προμήθεια ανά παραγγελία', 'Καμία', 'Περίπου 1,5% + 0,25€ (Stripe)'],
      ['Σύνδεση με τράπεζα', 'Δεν χρειάζεται', 'Ναι, μέσω του λογαριασμού σας στη Stripe'],
      ['Πίνακας διαχείρισης', '✓ Προϊόντα & τιμές', '✓ Προϊόντα & τιμές'],
      ['Ιδανικό αν', 'ξεκινάτε, έχετε λίγες παραγγελίες ή πελάτες που σας ξέρουν', 'έχετε πολλές παραγγελίες, πελάτες σε όλη την Ελλάδα και θέλετε να πληρώνονται αμέσως'],
    ],

    sLabel: 'Η πληρωμή με κάρτα, απλά', sTitle: 'Τα χρήματα πάνε σε εσάς. Η Stripe κρατά μια μικρή προμήθεια.',
    sLead: 'Η Stripe είναι η εταιρεία που περνάει τις πληρωμές με κάρτα — τη χρησιμοποιούν εκατομμύρια καταστήματα. Ο λογαριασμός είναι δικός σας και συνδέεται με την τράπεζά σας. Εμείς δεν βλέπουμε και δεν κρατάμε τίποτα από τις πωλήσεις σας.',
    calcT: 'Πόσο σας μένει από μια παραγγελία;', calcIn: 'Ποσό παραγγελίας (€)', calcFee: 'Κρατά η Stripe, περίπου', calcGet: 'Μένουν σε εσάς', calcNote: 'Ενδεικτικά, για τις συνηθισμένες ευρωπαϊκές κάρτες (1,5% + 0,25€). Κάποιες κάρτες κοστίζουν λίγο περισσότερο. Καμία μηνιαία συνδρομή — πληρώνετε μόνο όταν πουλάτε.',
    youT: 'Τι κάνετε εσείς — μία φορά',
    you: [
      ['Ανοίγετε λογαριασμό στη Stripe', '≈ 5 λεπτά', 'Με το email σας, στο stripe.com.'],
      ['Βάζετε το IBAN σας και επιβεβαιώνετε την ταυτότητά σας', '≈ 10 λεπτά', 'Με την ταυτότητα ή το διαβατήριό σας — έτσι τα χρήματα έρχονται στην τράπεζά σας.'],
      ['Μας γράφετε «έγινε»', '10 δευτερόλεπτα', 'Συνδέουμε εμείς το κατάστημα με τον λογαριασμό σας και κάνουμε δοκιμαστική παραγγελία.'],
    ],

    bandLabel: 'Ας ξεκινήσουμε', bandTitle: 'Πείτε μας τι πουλάτε. Το κατάστημα το στήνουμε εμείς.',
    bandLead: 'Μια σύντομη δωρεάν κλήση αρκεί: τι προϊόντα έχετε, πώς στέλνετε, και ποια από τις δύο επιλογές σας ταιριάζει.',
    bandCta: 'Θέλω e-shop', trust: ['0€ κατασκευή', '180€ + ΦΠΑ τον χρόνο', '260+ ιστοσελίδες', '140+ κριτικές 5★'],
  },
  en: {
    label: 'E-shop Creation',
    h1a: 'Your shop online.', h1b: 'From €0.',
    chips: ['Build €0', 'You change products & prices', 'Orders in your email', 'Cards too, whenever you want'],
    cta1: 'I want an e-shop', cta2: 'See the two options',
    shopName: 'Your shop', cart: 'Cart', add: 'Add to cart',
    products: [['Soy candle 200g', '€14.90', 'a'], ['Olive-oil soap', '€6.50', 'b'], ['Thyme honey 450g', '€9.80', 'c'], ['Ceramic mug', '€12.00', 'd']],
    send: 'Send order',
    illu: 'Illustration',

    oLabel: 'The two options', oTitle: 'Same shop. You choose how the customer pays.',
    oLead: 'In both, we build the whole shop and upload your products. The only difference: whether the customer pays online by card, or later, when you call them.',
    a: ['E-shop with orders by email', '€0', 'build', '€180 + VAT a year · hosting, domain and admin panel', [
      'A complete shop: categories, photos, prices, cart',
      'The customer sends the order with one button — it lands in your email',
      'Payment on delivery, by bank transfer or in store — as you decide',
      'You call them, confirm and ship with your courier',
      'Admin panel: you add products and change prices yourself',
      'No bank connection, no fee per order',
    ], 'What we recommend to start'],
    b: ['E-shop with card payments', '€350', '+ VAT build, once', '€240 + VAT a year · maintenance, hosting, domain', [
      'Everything in the first one',
      'The customer pays by card when ordering',
      'The money goes straight to your bank account — we never touch it',
      'Stripe keeps a small fee per order (about 1.5% + €0.25)',
      'You only open your Stripe account — we connect the rest',
      'The order arrives in your email already paid',
    ]],
    ctaA: 'I start with this', ctaB: 'I want card payments',
    vat: 'All prices exclude 24% VAT. You can start with the first and we add cards later, on the same shop.',

    fLabel: 'One order, step by step', fTitle: 'What happens when someone buys.',
    tabA: 'Order by email', tabB: 'Card payment',
    flowA: [
      ['The customer picks', 'Adds products to the cart, like in any e-shop.'],
      ['Sends the order', 'Writes name, phone, address and picks how to pay — e.g. cash on delivery.'],
      ['It lands in your email', 'With every detail: what, how many, total, where they live.'],
      ['You call and ship', 'You confirm, pack and ship with your courier. They pay on delivery.'],
    ],
    flowB: [
      ['The customer picks', 'Adds products to the cart, like in any e-shop.'],
      ['Pays by card', 'On a secure payment page. Card details never pass through us or you.'],
      ['It lands in your email, paid', 'The money goes to your Stripe account and from there to your bank.'],
      ['You ship', 'Pack and ship with your courier. No calls, no cash on delivery.'],
    ],
    mail: { inbox: 'Inbox', subj: 'New order #1042', from: 'Your shop', now: 'just now', cust: 'Customer', custV: 'Maria K. · 69•• ••• •••', addr: 'Address', addrV: 'Tsimiski ••, Thessaloniki', lines: [['2 × Soy candle 200g', '€29.80'], ['1 × Thyme honey 450g', '€9.80']], total: 'Total', totalV: '€39.60', pay: 'Payment', payA: 'Cash on delivery', payB: 'Paid by card ✓', nextA: 'Next step: call Maria, confirm and ship.', nextB: 'Payment done. Next step: ship it.' },

    cmpLabel: 'Which suits you', cmpTitle: 'The two options, side by side.',
    cmpHead: ['', 'Order by email', 'Card payment'],
    cmp: [
      ['Build', '€0', '€350 + VAT, once'],
      ['Every year', '€180 + VAT', '€240 + VAT'],
      ['How the customer pays', 'On delivery, by transfer or in store', 'By card, when ordering'],
      ['Fee per order', 'None', 'About 1.5% + €0.25 (Stripe)'],
      ['Bank connection', 'Not needed', 'Yes, through your Stripe account'],
      ['Admin panel', '✓ Products & prices', '✓ Products & prices'],
      ['Ideal if', 'you are starting, have few orders or customers who know you', 'you have many orders, customers all over Greece and want to be paid at once'],
    ],

    sLabel: 'Card payments, simply', sTitle: 'The money goes to you. Stripe keeps a small fee.',
    sLead: 'Stripe is the company that processes card payments — millions of shops use it. The account is yours and connects to your bank. We neither see nor keep anything from your sales.',
    calcT: 'How much is left from an order?', calcIn: 'Order amount (€)', calcFee: 'Stripe keeps, about', calcGet: 'Stays with you', calcNote: 'Indicative, for ordinary European cards (1.5% + €0.25). Some cards cost a little more. No monthly fee — you pay only when you sell.',
    youT: 'What you do — once',
    you: [
      ['Open a Stripe account', '≈ 5 min', 'With your email, at stripe.com.'],
      ['Add your IBAN and confirm your identity', '≈ 10 min', 'With your ID card or passport — so the money reaches your bank.'],
      ['Write us «done»', '10 seconds', 'We connect the shop to your account and place a test order.'],
    ],

    bandLabel: 'Let’s start', bandTitle: 'Tell us what you sell. We build the shop.',
    bandLead: 'A short free call is enough: what products you have, how you ship, and which of the two options suits you.',
    bandCta: 'I want an e-shop', trust: ['€0 build', '€180 + VAT a year', '260+ websites', '140+ 5★ reviews'],
  },
};

/* ─── Drawn shop: header, four products, cart, «send order» ─── */
function ShopMock({ t }) {
  return (
    <div className="esh-stage">
      <div className="esh-shop" aria-hidden="true">
        <div className="esh-top"><b>{t.shopName}</b><span className="esh-cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>{t.cart}<i>3</i></span></div>
        <div className="esh-grid">
          {t.products.map(([n, p, k], i) => (
            <div key={n} className="esh-prod" style={{ '--d': `${i * 90}ms` }}>
              <div className={`esh-img esh-${k}`}><span /></div>
              <div className="esh-pn">{n}</div>
              <div className="esh-pr"><b>{p}</b><span>{t.add}</span></div>
            </div>
          ))}
        </div>
        <div className="esh-send">{t.send}<span className="svc-tap" style={{ left: '62%', top: -2 }} /></div>
      </div>
      <OrderMail t={t} mode="a" floating />
      <div className="svc-illu">{t.illu}</div>
    </div>
  );
}

/* ─── The order e-mail the owner receives (changes with the A/B switch) ─── */
function OrderMail({ t, mode, floating = false }) {
  const m = t.mail;
  const paid = mode === 'b';
  return (
    <div className={`esh-mail ${floating ? 'esh-float' : ''}`} aria-hidden={floating ? 'true' : undefined}>
      <div className="esh-mh"><span className="esh-dot" />{m.inbox}<em>{m.now}</em></div>
      <div className="esh-subj">{m.subj}</div>
      <div className="esh-from">{m.from}</div>
      {!floating && (
        <>
          <div className="esh-row"><span>{m.cust}</span><b>{m.custV}</b></div>
          <div className="esh-row"><span>{m.addr}</span><b>{m.addrV}</b></div>
        </>
      )}
      <div className="esh-lines">
        {m.lines.map(([l, v]) => <div key={l} className="esh-row"><span>{l}</span><b>{v}</b></div>)}
        <div className="esh-row esh-tot"><span>{m.total}</span><b>{m.totalV}</b></div>
      </div>
      <div className={`esh-pay ${paid ? 'paid' : ''}`}><span>{m.pay}</span><b>{paid ? m.payB : m.payA}</b></div>
      {!floating && <div className="esh-next">{paid ? m.nextB : m.nextA}</div>}
    </div>
  );
}

function FeeCalc({ t, lang }) {
  const [amt, setAmt] = useState(50);
  const a = Math.max(0, parseFloat(amt) || 0);
  const fee = a > 0 ? a * 0.015 + 0.25 : 0;
  const f = (n) => n.toLocaleString(lang === 'el' ? 'el-GR' : 'en-GB', { style: 'currency', currency: 'EUR' });
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 h-full flex flex-col">
      <h3 className="text-white font-bold text-xl mb-5">{t.calcT}</h3>
      <label className="esh-in">{t.calcIn}<input type="number" min="0" step="1" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value)} /></label>
      <div className="esh-calc-out">
        <div><span>{t.calcFee}</span><b>{f(fee)}</b></div>
        <div className="get"><span>{t.calcGet}</span><b>{f(Math.max(0, a - fee))}</b></div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed mt-auto pt-5">{t.calcNote}</p>
    </div>
  );
}

export default function EshopClient({ service }) {
  const lang = useLang();
  const t = T[lang];
  const [mode, setMode] = useState('a');
  const flow = mode === 'a' ? t.flowA : t.flowB;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[20%] -left-[10%] w-[820px] h-[520px] rounded-full esh-glow-a" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[520px] h-[520px] rounded-full esh-glow-b" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-10 items-center">
          <div>
            <ScrollReveal>
              <span className="section-label">{t.label}</span>
              <h1 className="font-black font-display text-white tracking-tight leading-[1.06] mb-6" style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.1rem)' }}>
                {t.h1a}<br /><span className="text-electric-cyan">{t.h1b}</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">{service.pitch[lang]}</p>
              <Chips items={t.chips} />
              <div className="flex flex-wrap gap-3">
                <a href="#contact" className="btn-premium inline-flex items-center gap-2 px-8 py-4 bg-electric-cyan text-[#050608] font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-colors" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.35)' }}>{t.cta1}</a>
                <a href="#epiloges" className="btn-premium btn-ghost inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-black text-sm uppercase tracking-[0.1em] rounded-xl hover:bg-white hover:text-[#050608] transition-colors">{t.cta2}</a>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={160} direction="scale"><ShopMock t={t} /></ScrollReveal>
        </div>
      </section>

      {/* ─── THE TWO OPTIONS ─── */}
      <section id="epiloges" className="py-24 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <Head center label={t.oLabel} title={t.oTitle} lead={t.oLead} />
          <div className="grid md:grid-cols-2 gap-6 mt-16 items-stretch">
            <ScrollReveal direction="left" className="h-full"><PriceCard tier={t.a[0]} price={t.a[1]} priceNote={t.a[2]} sub={t.a[3]} items={t.a[4]} hot badge={t.a[5]} cta={t.ctaA} /></ScrollReveal>
            <ScrollReveal direction="right" delay={100} className="h-full"><PriceCard tier={t.b[0]} price={t.b[1]} priceNote={t.b[2]} sub={t.b[3]} items={t.b[4]} cta={t.ctaB} /></ScrollReveal>
          </div>
          <ScrollReveal className="mt-6"><p className="text-center text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">{t.vat}</p></ScrollReveal>
        </div>
      </section>

      {/* ─── ONE ORDER, STEP BY STEP (A/B switch) ─── */}
      <section className="py-24 bg-[#0b0c10]/60 border-y border-electric-cyan/8 mv-shoulder esh-band">
        <div className="max-w-6xl mx-auto px-6">
          <Head center label={t.fLabel} title={t.fTitle} />
          <div className="esh-tabs" role="tablist" aria-label={t.fLabel}>
            {[['a', t.tabA], ['b', t.tabB]].map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={mode === k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>{l}</button>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center mt-10">
            <ol className="esh-flow" key={mode}>
              {flow.map(([h, b], i) => (
                <li key={h} style={{ '--d': `${i * 70}ms` }}>
                  <span className="esh-n">{i + 1}</span>
                  <div><b>{h}</b><p>{b}</p></div>
                </li>
              ))}
            </ol>
            <div className="esh-mail-wrap"><OrderMail t={t} mode={mode} /></div>
          </div>
        </div>
      </section>

      {/* ─── SIDE BY SIDE ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Head center label={t.cmpLabel} title={t.cmpTitle} />
          <ScrollReveal className="mt-12">
            <div className="esh-cmp" role="table">
              <div className="esh-cmp-row esh-cmp-head" role="row">
                {t.cmpHead.map((h, i) => <div key={i} role="columnheader" className={i === 1 ? 'hot' : ''}>{h}</div>)}
              </div>
              {t.cmp.map(([k, a, b]) => (
                <div key={k} className="esh-cmp-row" role="row">
                  <div role="rowheader">{k}</div>
                  <div role="cell" className="hot" data-h={t.cmpHead[1]}>{a}</div>
                  <div role="cell" data-h={t.cmpHead[2]}>{b}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CARD PAYMENTS, SIMPLY ─── */}
      <section className="py-24 bg-[#0b0c10]/60 border-y border-electric-cyan/8 mv-shoulder esh-band">
        <div className="max-w-6xl mx-auto px-6">
          <Head label={t.sLabel} title={t.sTitle} lead={t.sLead} />
          <div className="grid lg:grid-cols-2 gap-6 mt-12 items-stretch">
            <ScrollReveal direction="left" className="h-full"><FeeCalc t={t} lang={lang} /></ScrollReveal>
            <ScrollReveal direction="right" delay={100} className="h-full">
              <div className="glass-panel rounded-3xl p-6 md:p-8 h-full">
                <h3 className="text-white font-bold text-xl mb-5">{t.youT}</h3>
                <ol className="esh-you">
                  {t.you.map(([h, time, b], i) => (
                    <li key={h}>
                      <span className="esh-n">{i + 1}</span>
                      <div><b>{h}</b> <span className="svc-time">{time}</span><p>{b}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <StepsSection service={service} />

      <FaqSection service={service} />

      {/* ─── BAND ─── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 p-10 md:p-14 text-center esh-cta">
              <span className="section-label">{t.bandLabel}</span>
              <h2 className="font-black font-display text-white tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}>{t.bandTitle}</h2>
              <p className="text-gray-400 text-lg mb-7 max-w-2xl mx-auto">{t.bandLead}</p>
              <Link href="#contact" className="btn-premium inline-flex items-center gap-3 px-10 py-4 bg-electric-cyan text-[#050608] font-black text-base uppercase tracking-[0.1em] rounded-xl hover:bg-white transition-all" style={{ boxShadow: '0 0 30px rgba(71,200,245,0.4)' }}>{t.bandCta}</Link>
              <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mt-6 text-sm text-gray-400">{t.trust.map((s) => <span key={s}><b className="text-white">{s.split(' ')[0]}</b> {s.split(' ').slice(1).join(' ')}</span>)}</div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
