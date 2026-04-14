import { create } from "zustand";

type UIState = {
  sidebarExpanded: boolean;
  setSidebarExpanded: (value: boolean) => void;
  toggleSidebar: () => void;
  xaiOpen: boolean;
  setXaiOpen: (value: boolean) => void;
  toggleXai: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarExpanded: false,
  setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  xaiOpen: false,
  setXaiOpen: (xaiOpen) => set({ xaiOpen }),
  toggleXai: () => set((state) => ({ xaiOpen: !state.xaiOpen })),
}));
