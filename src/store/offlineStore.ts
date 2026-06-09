import { create } from 'zustand';

/**
 * Interface defining the Offline state and connection tracking.
 */
interface OfflineState {
  /** Indicates whether the browser has an active internet connection */
  isOnline: boolean;
  /** Counter for records waiting to be pushed to the remote server */
  pendingSyncCount: number;
  /** Action to explicitly update the network status */
  setOnlineStatus: (status: boolean) => void;
  /** Action to update the count of unsynced records */
  setPendingSyncCount: (count: number) => void;
}

/**
 * Zustand store for managing the offline/online network state.
 */
export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: navigator.onLine,
  pendingSyncCount: 0,
  setOnlineStatus: (status) => set({ isOnline: status }),
  setPendingSyncCount: (count) => set({ pendingSyncCount: count }),
}));
