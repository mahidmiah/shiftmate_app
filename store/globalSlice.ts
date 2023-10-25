import { StateCreator } from 'zustand';

export type GlobalSlice = {
  darkMode: boolean;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
  setDark: () => void;
  setLight: () => void;
};

export const createGlobalSlice: StateCreator<GlobalSlice> = (set) => ({
  darkMode: true,
  isMobileMenuOpen: false,
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  setDark: () => set({ darkMode: true }),
  setLight: () => set({ darkMode: false }),
});
