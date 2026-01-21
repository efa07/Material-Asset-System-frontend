import { create } from "zustand";

interface AuthState {
  token: string | null;
  roles: string[];
  username: string | null;
  setAuth: (token: string, roles: string[], username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  roles: [],
  username: null,

  setAuth: (token, roles, username) =>
    set({ token, roles, username }),

  clearAuth: () =>
    set({ token: null, roles: [], username: null }),
}));
