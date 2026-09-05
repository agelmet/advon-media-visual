// store/langStore.js
import { create } from 'zustand';

export const useLangStore = create((set) => ({
  lang: 'el',
  setLang: (lang) => set({ lang: lang === 'en' ? 'en' : 'el' }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'el' ? 'en' : 'el' })),
}));
