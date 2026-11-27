// lib/nav.js
// Menu labels only — imported by the header, footer and mobile bar so those client
// components do not pull the whole 66KB service catalogue into every page's JavaScript.
// Keep in sync with lib/services.js when a service is added or renamed.

export const NAV_SERVICES = [
  { slug: 'kataskevi-istoselidas', el: 'Κατασκευή Ιστοσελίδων', en: 'Website Creation' },
  { slug: 'kataskevi-eshop', el: 'Κατασκευή E-shop', en: 'E-shop Creation' },
  { slug: 'diaxeirisi-social-media', el: 'Social Media', en: 'Social Media' },
  { slug: 'google-ads', el: 'Google Ads', en: 'Google Ads' },
  { slug: 'google-reviews-nfc', el: 'Παρουσία στο Google', en: 'Google Presence' },
  { slug: 'online-rantevou', el: 'Online Ραντεβού', en: 'Online Booking' },
  { slug: 'ai-voithos', el: 'AI Βοηθός Ιστοσελίδας', en: 'Website AI Assistant' },
  { slug: 'psifiako-menou-qr', el: 'Ψηφιακό Μενού QR', en: 'QR Digital Menu' },
  { slug: 'custom-logismiko', el: 'AI Αυτοματισμός Επιχείρησης', en: 'AI Business Automation' },
];

export const IDENTITY = {
  el: 'Ιστοσελίδες & ψηφιακά εργαλεία για ελληνικές επιχειρήσεις',
  en: 'Websites & digital tools for Greek businesses',
};
