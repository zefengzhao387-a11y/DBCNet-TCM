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
    <motion.aside
      initial={false}
      animate={{ width: expanded ? "var(--sidebar-expanded)" : "var(--sidebar-collapsed)" }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="floating-sidebar-shell relative z-20 flex h-full shrink-0 flex-col py-4 pl-3 pr-2"
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
            className="truncate text-sm font-semibold tracking-tight text-foreground"
          >
            DBCNet
          </motion.span>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl"
          onClick={toggleSidebar}
          aria-label={expanded ? "收起侧栏" : "展开侧栏"}
        >
          <PanelLeft className="size-[1.125rem]" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            className={cn(
              "h-11 justify-start gap-3 rounded-2xl px-2 text-muted-foreground hover:text-foreground",
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
            "h-11 w-full rounded-2xl text-muted-foreground hover:text-foreground",
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
  );
}
