// lib/fonts.js
// Self-hosted Google Fonts via next/font: downloaded at build time, served from
// advonmedia.com, preloaded, with size-adjusted fallbacks (no layout shift).
// Both faces ship Greek glyphs — verified against Google Fonts metadata (Sept 2026).
import { GFS_Didot, Manrope } from 'next/font/google';

export const displayFont = GFS_Didot({
  weight: '400',
  subsets: ['greek', 'latin'],
  display: 'swap',
  variable: '--font-gfs-didot',
  fallback: ['Literata', 'Georgia', 'Times New Roman', 'serif'],
});

export const bodyFont = Manrope({
  subsets: ['greek', 'latin'],
  display: 'optional', // body text never re-flows after first paint; the size-adjusted fallback stands in if the font is late
  preload: false,      // fetched at low priority for the next page view; keeps the first paint free of font requests
  variable: '--font-manrope',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});
