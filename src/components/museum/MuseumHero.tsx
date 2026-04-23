"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";

function TitleSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group/seal relative shrink-0 cursor-default"
      whileHover={{
        y: 1.5,
        transition: { type: "spring", stiffness: 420, damping: 32 },
      }}
      aria-hidden
    >
      <motion.div
        className="flex h-[5rem] w-9 items-center justify-center rounded-sm border border-rose-200/50 bg-gradient-to-b from-rose-100/95 via-rose-50/90 to-[#f4e8e8] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_22px_rgba(120,72,72,0.08)] transition-shadow duration-500 dark:border-rose-400/25 dark:from-rose-950/50 dark:via-rose-900/35 dark:to-rose-950/55 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_22px_rgba(0,0,0,0.35)] group-hover/seal:border-rose-200/70 group-hover/seal:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_26px_rgba(120,72,72,0.1)] dark:group-hover/seal:border-rose-400/35"
        animate={{ opacity: [0.88, 1, 0.88] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="select-none font-serif text-[7.5px] font-medium leading-[1.45] tracking-[0.08em] text-[#5c4a4a] [writing-mode:vertical-rl] dark:text-rose-200/95">
          岐黄智诊
        </span>
      </motion.div>
    </motion.div>
  );
}

export function MuseumHero() {
  const { label } = useSeasonTheme();

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center pb-12 pt-[max(7.25rem,calc(env(safe-area-inset-top,0px)+4.85rem))] text-center sm:min-h-[100dvh] sm:pb-20 sm:pt-[max(9.5rem,calc(env(safe-area-inset-top,0px)+6.25rem))] lg:pb-32 lg:pt-40">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mb-9 max-w-lg font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.28em] text-muted-foreground"
      >
        多模态辨证 · 舌象与问卷体质自测
        <span className="mx-2 text-border">·</span>
        <span className="text-muted-foreground/90">{label}</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-12 sm:flex-row sm:items-end sm:justify-center sm:gap-14"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[min(92vw,40rem)] text-center sm:text-left"
        >
          <p className="font-serif text-[clamp(1.85rem,5vw,3.1rem)] font-medium leading-[1.18] tracking-[0.12em] text-foreground">
            岐黄智诊
          </p>
          <p className="mt-5 font-serif text-[clamp(1.05rem,2.8vw,1.45rem)] font-normal leading-[1.75] tracking-[0.08em] text-foreground/85">
            让中医可感知，可解释，可持续
          </p>
          <p className="mt-6 max-w-[min(92vw,34rem)] text-pretty text-center font-sans text-[clamp(0.95rem,2.55vw,1.2rem)] font-normal leading-[1.68] tracking-[0.03em] text-muted-foreground sm:max-w-[30rem] sm:text-left">
            基于多模态感知的中医大模型辅助诊断系统
          </p>
        </motion.div>
        <TitleSeal />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
      >
        <Button
          asChild
          size="lg"
          className="h-12 min-h-[48px] w-full rounded-full border border-[color-mix(in_srgb,var(--season-accent)_32%,#d6d3d1)] bg-[color-mix(in_srgb,var(--season-accent)_12%,#ffffff)] px-9 text-[13.5px] font-medium tracking-wide text-foreground shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_6px_20px_rgba(42,50,44,0.06)] transition duration-300 hover:bg-[color-mix(in_srgb,var(--season-accent)_18%,#ffffff)] active:scale-[0.99] dark:border-[color-mix(in_srgb,var(--season-accent)_40%,#3f3f3f)] dark:bg-[color-mix(in_srgb,var(--season-accent)_22%,#1a1c1a)] dark:text-primary-foreground dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_6px_20px_rgba(0,0,0,0.35)] dark:hover:bg-[color-mix(in_srgb,var(--season-accent)_32%,#222524)] sm:w-auto sm:min-w-[12rem]"
        >
          <Link href="/constitution">多模态体质识别</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 min-h-[48px] w-full rounded-full border border-stone-300/95 bg-white/70 px-9 text-[13.5px] font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm transition duration-300 hover:border-stone-400/90 hover:bg-white/92 active:scale-[0.99] dark:border-stone-500/40 dark:bg-stone-900/55 dark:text-foreground dark:hover:border-stone-500/50 dark:hover:bg-stone-800/65 sm:w-auto sm:min-w-[12rem]"
        >
          <Link href="#home-bento">浏览核心功能</Link>
        </Button>
      </motion.div>
    </div>
  );
}
