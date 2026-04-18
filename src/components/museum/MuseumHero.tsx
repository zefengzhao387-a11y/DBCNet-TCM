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
        className="flex h-[5rem] w-9 items-center justify-center rounded-sm border border-[#c45c5c]/35 bg-gradient-to-b from-[#d47272]/95 via-[#b85656] to-[#9a4545] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(90,42,42,0.12)] transition-shadow duration-500 group-hover/seal:border-[#b85c5c]/45 group-hover/seal:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_rgba(90,42,42,0.14),0_0_20px_rgba(200,96,96,0.18)]"
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="select-none font-serif text-[7.5px] font-medium leading-[1.45] tracking-[0.08em] text-white/95 [writing-mode:vertical-rl]">
          黄岐智鉴
        </span>
      </motion.div>
    </motion.div>
  );
}

export function MuseumHero() {
  const { label } = useSeasonTheme();

  return (
    <div className="relative z-10 flex min-h-[min(100dvh,880px)] flex-col items-center justify-center pb-12 pt-[max(7.25rem,calc(env(safe-area-inset-top,0px)+4.85rem))] text-center sm:min-h-[min(100dvh,880px)] sm:pb-20 sm:pt-[max(9.5rem,calc(env(safe-area-inset-top,0px)+6.25rem))] lg:pb-32 lg:pt-40">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mb-9 max-w-lg font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.28em] text-stone-500"
      >
        多模态辨证 · 舌象与问卷体质自测
        <span className="mx-2 text-stone-300">·</span>
        <span className="text-stone-400">{label}</span>
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
          className="max-w-[min(92vw,38rem)] text-center sm:text-left"
        >
          <p className="font-serif text-[clamp(1.85rem,5vw,3.1rem)] font-medium leading-[1.15] tracking-[0.14em] text-stone-800">
            黄岐智鉴
          </p>
          <p className="mt-6 font-serif text-[clamp(1.35rem,3.4vw,2.1rem)] font-normal leading-snug tracking-[0.2em] text-stone-600">
            双分支辨证与可解释图谱
          </p>
          <p className="mt-3 font-display text-[clamp(0.62rem,1.65vw,0.78rem)] font-medium uppercase tracking-[0.38em] text-stone-400/95">
            DBCNet · Multimodal TCM
          </p>
        </motion.div>
        <TitleSeal />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-11 max-w-md text-pretty font-sans text-[15px] font-light leading-[1.95] text-stone-500 sm:max-w-lg sm:text-[15.5px]"
      >
        跨越千年的东方生命观，在此以光、雾与数据，重构成一座可步入的展厅。
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
      >
        <Button
          asChild
          size="lg"
          className="h-12 min-h-[48px] w-full rounded-full border border-[color-mix(in_srgb,var(--season-accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--season-accent)_14%,white)] px-9 text-[13.5px] font-medium tracking-wide text-stone-800 shadow-sm transition duration-300 hover:bg-[color-mix(in_srgb,var(--season-accent)_22%,white)] active:scale-[0.99] sm:w-auto sm:min-w-[11.5rem]"
        >
          <Link href="/clinical">进入临床决策支持</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 min-h-[48px] w-full rounded-full border border-stone-200/90 bg-white/50 px-9 text-[13.5px] font-medium tracking-wide text-stone-600 shadow-sm backdrop-blur-sm transition duration-300 hover:border-stone-300 hover:bg-white/80 hover:text-stone-800 active:scale-[0.99] sm:w-auto sm:min-w-[11.5rem]"
        >
          <Link href="#modules">浏览核心模块</Link>
        </Button>
      </motion.div>
    </div>
  );
}
