import { create } from 'zustand';
import type { User } from '../db/models';

/**
 * Interface defining the global Authentication state and its actions.
 */
interface AuthState {
  /** The currently logged-in user, or null if unauthenticated */
  user: User | null;
  /** Boolean derivative of whether a user is present */
  isAuthenticated: boolean;
  /** Action to log a user into the system */
  login: (user: User) => void;
  /** Action to log the current user out */
  logout: () => void;
}

/**
 * Zustand store for managing application-wide authentication state.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
