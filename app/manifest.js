// app/manifest.js — web app manifest (27 Nov 2026): the Advon mark when the site is saved to a phone's home screen.
export default function manifest() {
  return {
    name: 'Advon Media',
    short_name: 'Advon Media',
    description: 'Κατασκευή ιστοσελίδων & ψηφιακά εργαλεία για ελληνικές επιχειρήσεις.',
    start_url: '/',
    display: 'browser',
    background_color: '#050608',
    theme_color: '#050608',
    icons: [
      { src: '/img/advon-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/img/advon-icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/img/advon-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
