"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { XaiPanel } from "./XaiPanel";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isMuseumHome = pathname === "/";

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center justify-center"
          >
            {children}
          </motion.div>
        ) : isMuseumHome ? (
          <motion.div
            key="route-museum"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full min-w-0"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="route-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 gap-0 overflow-hidden lg:gap-3"
          >
            <Sidebar />
            <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-3">
              <Topbar />
              <main className="main-canvas-inner min-h-0 flex-1 overflow-hidden p-3 sm:p-5 lg:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full min-h-0"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
            <div className="relative z-10 h-full w-0 min-w-0 shrink-0 overflow-visible lg:overflow-hidden">
              <XaiPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
