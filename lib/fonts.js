// lib/fonts.js — the same two families the site always used (Playfair Display for
// headlines, Inter for text), now served from advonmedia.com itself through next/font.
// Same look, no render-blocking round-trip to Google Fonts, no layout shift.
import { Playfair_Display, Inter } from 'next/font/google';

export const displayFont = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-playfair',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const bodyFont = Inter({
  subsets: ['latin', 'latin-ext', 'greek'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});
