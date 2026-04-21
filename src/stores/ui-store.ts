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
  /** 默认展开，避免大屏误以为没有「逻辑链」侧栏（可手动收起） */
  xaiOpen: true,
  setXaiOpen: (xaiOpen) => set({ xaiOpen }),
  toggleXai: () => set((state) => ({ xaiOpen: !state.xaiOpen })),
}));
