import { create } from 'zustand';
import type { Settings } from '../db/models';

/**
 * Default fallback configuration used if no settings row is found in Dexie.
 */
const defaultSettings: Settings = {
  storeName: { ar: 'متجر', en: 'Store', nl: 'Winkel' },
  storeAddress: '',
  taxNumber: '',
  currency: 'EUR',
  currencySymbol: '€',
  defaultInvoiceLanguage: 'nl',
  taxRate: 21,
  enableCustomerDisplay: false,
  receiptFooter: { ar: 'شكراً لزيارتكم', en: 'Thank you for your visit', nl: 'Bedankt voor uw bezoek' },
  enableOfflineMode: true,
  autoOpenDrawerOnCash: true
};

/**
 * Interface defining the global Settings state.
 */
interface SettingsState {
  /** The current active store configuration */
  settings: Settings;
  /** Action to load or update settings from the database into state */
  setSettings: (settings: Settings) => void;
}

/**
 * Zustand store for managing global store configurations loaded from Dexie.
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  setSettings: (settings) => set({ settings }),
}));
