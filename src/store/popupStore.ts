import { create } from 'zustand';

export type PopupType = 'success' | 'error' | 'info' | 'confirm';

interface PopupState {
  isOpen: boolean;
  type: PopupType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  
  showPopup: (params: { type: PopupType; title: string; message: string; onConfirm?: () => void; onCancel?: () => void }) => void;
  closePopup: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
  onConfirm: undefined,
  onCancel: undefined,

  showPopup: (params) => set({ ...params, isOpen: true }),
  closePopup: () => set({ isOpen: false, onConfirm: undefined, onCancel: undefined }),
}));
