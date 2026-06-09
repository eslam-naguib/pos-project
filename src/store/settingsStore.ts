import { create } from 'zustand';
import type { Settings } from '../db/models';

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

interface SettingsState {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  setSettings: (settings) => set({ settings }),
}));
