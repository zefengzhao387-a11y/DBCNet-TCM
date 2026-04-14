"use client";

import { motion } from "framer-motion";
import { LogOut, Network, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

function formatNow(d: Date) {
  return d.toLocaleString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export function Topbar() {
  const router = useRouter();
  const { label } = useSeasonTheme();
  const [now, setNow] = useState(() => formatNow(new Date()));
  const toggleXai = useUIStore((s) => s.toggleXai);
  const xaiOpen = useUIStore((s) => s.xaiOpen);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  useEffect(() => {
    const id = window.setInterval(() => setNow(formatNow(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.header
      layout
      className="glass-topbar flex shrink-0 items-center gap-3 px-4 py-3"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
        <p className="truncate text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{now}</p>
      </div>

      <div className="relative hidden min-w-0 flex-[1.25] md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <div className="h-10 w-full rounded-xl border border-input/80 bg-background/30 pl-10 pr-3 text-sm leading-10 text-muted-foreground backdrop-blur-sm">
          全局检索…
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:text-foreground"
          aria-label="退出登录"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
        </Button>
        <Button
          type="button"
          variant={xaiOpen ? "secondary" : "outline"}
          size="sm"
          className="shrink-0 gap-2 rounded-xl border-dashed"
          onClick={toggleXai}
        >
          <Network className="size-4" />
          <span className="hidden sm:inline">XAI 溯源</span>
        </Button>
      </div>
    </motion.header>
  );
}
