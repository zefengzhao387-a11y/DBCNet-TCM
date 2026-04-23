"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, type ReactNode } from "react";

import { Atmosphere } from "@/components/background/Atmosphere";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { syncZenFromDocument, useUIStore } from "@/stores/ui-store";

import { ZenModeToggle } from "@/components/zen/ZenModeToggle";

import { AppWorkspaceDock } from "./AppWorkspaceDock";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { XaiPanel } from "./XaiPanel";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isMuseumHome = pathname === "/";
  const { season } = useSeasonTheme();
  const setXaiOpen = useUIStore((s) => s.setXaiOpen);
  const zenMode = useUIStore((s) => s.zenMode);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  useLayoutEffect(() => {
    syncZenFromDocument();
  }, []);

  useEffect(() => {
    if (isLogin) return;
    void fetchSession();
  }, [isLogin, fetchSession]);

  /** 进入临床页默认展开逻辑链，避免右侧被裁切时误以为「没有面板」 */
  useLayoutEffect(() => {
    if (pathname === "/clinical") {
      setXaiOpen(true);
    }
  }, [pathname, setXaiOpen]);

  const shellPadding = !isMuseumHome && !isLogin;

  return (
    <div
      className={cn(
        "relative z-0 flex w-full",
        isMuseumHome && "min-h-screen overflow-x-hidden overflow-y-auto",
        isLogin && "h-[100dvh] max-h-[100dvh] overflow-hidden app-safe-padding",
        shellPadding &&
          "h-[100dvh] max-h-[100dvh] overflow-hidden app-safe-padding sm:gap-1",
      )}
    >
      <div
        className={cn(
          "pointer-events-none z-0 overflow-hidden translate-z-0 [backface-visibility:hidden]",
          isMuseumHome
            ? "absolute inset-0 min-h-full"
            : "fixed inset-0",
        )}
      >
        <Atmosphere
          season={season}
          zenMode={zenMode}
          layout={isMuseumHome ? "scroll" : "viewport"}
        />
      </div>
      {!isMuseumHome ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(900px circle at 50% 120%, var(--canvas-vignette), transparent 55%)",
          }}
          aria-hidden
        />
      ) : null}
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="route-login"
            initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -12 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center justify-center"
          >
            <div
              className="pointer-events-auto fixed right-4 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-30 sm:right-6 sm:top-6"
              data-zen-toggle-anchor
            >
              <ZenModeToggle withLabel size="md" />
            </div>
            {children}
          </motion.div>
        ) : isMuseumHome ? (
          /**
           * 首页仅用 opacity 过场，避免对子节点使用 transform / filter（否则其内 `position: fixed`
           * 的顶栏会相对本层定位，随 `overflow-y-auto` 一起滚动，无法贴在视口顶端）。
           */
          <motion.div
            key="route-museum"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full min-w-0"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="route-app"
            initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -14 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 gap-0 overflow-hidden lg:gap-3"
          >
            <Sidebar />
            <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-3">
              <Topbar />
              <main className="main-canvas-inner min-h-0 flex-1 overflow-hidden p-3 pb-[max(5.75rem,env(safe-area-inset-bottom,0px)+4.5rem)] sm:p-5 sm:pb-[max(5.75rem,env(safe-area-inset-bottom,0px)+4.5rem)] lg:p-6 lg:pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                    transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full min-h-0"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
            <div className="relative z-10 flex h-full min-w-0 shrink-0 overflow-visible">
              <XaiPanel />
            </div>
            <AppWorkspaceDock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
