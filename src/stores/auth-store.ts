import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  staffId: string;
  displayName: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (staffId: string, password: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (staffId, password) => {
        void password;
        const id = staffId.trim() || "guest";
        set({
          isAuthenticated: true,
          user: {
            id: `mock-${id}`,
            staffId: id,
            displayName: id === "guest" ? "访客医师" : `${id} · 医师`,
          },
        });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "dbcnet-auth-mock",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
