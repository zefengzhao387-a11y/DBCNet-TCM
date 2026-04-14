"use client";

import { motion } from "framer-motion";
import { BookOpen, PanelLeft, Stethoscope, UserRound, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

const nav = [
  { icon: Stethoscope, label: "问诊" },
  { icon: UtensilsCrossed, label: "膳食" },
  { icon: BookOpen, label: "百科" },
] as const;

export function Sidebar() {
  const expanded = useUIStore((s) => s.sidebarExpanded);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {expanded ? (
        <button
          type="button"
          aria-label="关闭侧栏"
          className="fixed inset-0 z-[70] bg-background/40 backdrop-blur-[3px] transition-opacity lg:hidden"
          onClick={toggleSidebar}
        />
      ) : null}
      <motion.aside
        initial={false}
        animate={{ width: expanded ? "var(--sidebar-expanded)" : "var(--sidebar-collapsed)" }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "floating-sidebar-shell relative z-[80] flex h-full shrink-0 flex-col py-4 pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-2",
          expanded &&
            "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:z-[80] max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:border-r max-lg:border-border/50 max-lg:shadow-[24px_0_48px_rgba(0,0,0,0.08)] max-lg:py-[max(0.75rem,env(safe-area-inset-top))] max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div
          className={cn(
            "mb-6 flex items-center gap-1 px-1",
            expanded ? "justify-between" : "justify-center",
          )}
        >
          {expanded ? (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground"
            >
              DBCNet
            </motion.span>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-xl sm:h-10 sm:w-10"
            onClick={toggleSidebar}
            aria-label={expanded ? "收起侧栏" : "展开侧栏"}
          >
            <PanelLeft className="size-[1.125rem]" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="主导航">
          {nav.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              className={cn(
                "h-12 min-h-12 justify-start gap-3 rounded-2xl px-2 text-muted-foreground hover:text-foreground sm:h-11 sm:min-h-0",
                !expanded && "justify-center gap-0 px-0",
              )}
              title={label}
            >
              <Icon className="size-[1.125rem] shrink-0 text-season-accent" />
              {expanded ? (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="truncate text-sm font-medium"
                >
                  {label}
                </motion.span>
              ) : null}
            </Button>
          ))}
        </nav>

        {expanded && user ? (
          <p className="mb-2 truncate px-2 text-[11px] leading-snug text-muted-foreground">
            {user.displayName}
          </p>
        ) : null}

        <div className="mt-auto border-t border-border/60 pt-3">
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "h-12 min-h-12 w-full rounded-2xl text-muted-foreground hover:text-foreground sm:h-11 sm:min-h-0",
              expanded ? "justify-start gap-3 px-2" : "justify-center px-0",
            )}
            title="个人中心"
          >
            <UserRound className="size-[1.125rem] shrink-0 text-season-accent" />
            {expanded ? (
              <span className="text-sm font-medium">个人中心</span>
            ) : null}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
