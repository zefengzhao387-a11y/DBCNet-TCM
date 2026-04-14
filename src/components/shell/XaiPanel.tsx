"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useUIStore } from "@/stores/ui-store";

export function XaiPanel() {
  const open = useUIStore((s) => s.xaiOpen);
  const setXaiOpen = useUIStore((s) => s.setXaiOpen);

  return (
    <motion.div
      initial={false}
      animate={{
        width: open ? "var(--xai-drawer-width)" : 0,
        opacity: open ? 1 : 0,
        marginLeft: open ? "0.75rem" : 0,
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 h-full shrink-0 overflow-hidden"
    >
      <motion.aside
        initial={false}
        animate={
          open
            ? { x: 0, filter: "blur(0px)", opacity: 1 }
            : { x: 20, filter: "blur(4px)", opacity: 0 }
        }
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="xai-drawer-shell flex h-full w-[var(--xai-drawer-width)] min-w-[var(--xai-drawer-width)] flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Sparkles className="size-4 text-season-accent" />
            逻辑链
          </div>
          <button
            type="button"
            onClick={() => setXaiOpen(false)}
            className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            收起
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
          <p className="max-w-[14rem] leading-relaxed">
            方剂证据图谱将在此以力导向图呈现，背景透明、流光动效已预留接口。
          </p>
          <div className="h-32 w-full max-w-[12rem] rounded-2xl border border-dashed border-border/80 bg-background/20" />
        </div>
      </motion.aside>
    </motion.div>
  );
}
