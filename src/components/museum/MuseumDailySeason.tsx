"use client";

import { motion } from "framer-motion";
import { BookMarked, CalendarDays, Leaf, Sparkles } from "lucide-react";

import { getDailyTcmForDate } from "@/data/daily-tcm";
import { SEASONAL_WELLNESS } from "@/data/seasonal-wellness";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { getSolarTermName } from "@/lib/solar-term";

function formatZhCalendar(d: Date): string {
  return d.toLocaleDateString("zh-CN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MuseumDailySeason() {
  const now = new Date();
  const {
    season,
    seasonZh,
    label,
    themeSkinLabel,
    calendarSeasonHint,
  } = useSeasonTheme();

  const daily = getDailyTcmForDate(now);
  const solar = getSolarTermName(now);
  const wellness = SEASONAL_WELLNESS[season];

  return (
    <section
      id="daily-season"
      className="relative z-10 scroll-mt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))] pb-20 pt-12 sm:pb-24 sm:pt-16"
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[12px] text-stone-500 sm:text-[13px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/70 px-3 py-1 shadow-sm">
              <CalendarDays className="size-3.5 text-stone-400" aria-hidden />
              <span className="text-stone-600">{formatZhCalendar(now)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/70 px-3 py-1 shadow-sm">
              <Sparkles className="size-3.5 text-[color-mix(in_srgb,var(--season-accent)_45%,#78716c)]" aria-hidden />
              节气（公历近似）· <strong className="font-medium text-stone-700">{solar}</strong>
            </span>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
              四时 · 界面主题
            </p>
            <p className="text-right font-serif text-[15px] font-medium tracking-[0.06em] text-stone-800">
              当前为 <strong className="text-[color-mix(in_srgb,var(--season-accent)_55%,#44403c)]">{seasonZh}</strong>
              季 · {label}
            </p>
            <p className="max-w-md text-right font-sans text-[12px] leading-relaxed text-stone-500 sm:text-[12.5px]">
              主题皮肤：<span className="font-medium text-stone-700">{themeSkinLabel}</span>
            </p>
            <p className="max-w-md text-right font-sans text-[11px] leading-relaxed text-stone-400">
              {calendarSeasonHint}
            </p>
          </div>
        </motion.div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.78, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="museum-glass-card relative min-w-0 p-6 sm:p-8"
          >
            <div className="mb-5 flex min-w-0 items-center gap-2 border-b border-stone-200/60 pb-4">
              <BookMarked className="size-4 shrink-0 text-[color-mix(in_srgb,var(--season-accent)_48%,#78716c)]" aria-hidden />
              <h2 className="font-serif text-lg font-medium tracking-[0.12em] text-stone-800">
                每日一词
              </h2>
            </div>
            <p className="font-serif text-[clamp(1.75rem,4vw,2.35rem)] font-medium tracking-[0.14em] text-stone-800">
              {daily.term}
            </p>
            {daily.reading ? (
              <p className="mt-2 font-sans text-[13px] text-stone-400">{daily.reading}</p>
            ) : null}
            <p className="mt-5 font-sans text-[14px] font-light leading-[1.85] text-stone-600">
              {daily.gloss}
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.78, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="museum-glass-card relative min-w-0 p-6 sm:p-8"
          >
            <div className="mb-5 flex min-w-0 items-center gap-2 border-b border-stone-200/60 pb-4">
              <Leaf className="size-4 shrink-0 text-[color-mix(in_srgb,var(--season-accent)_48%,#78716c)]" aria-hidden />
              <h2 className="font-serif text-lg font-medium tracking-[0.12em] text-stone-800">
                时令养生
              </h2>
            </div>
            <h3 className="font-serif text-[1.15rem] font-medium text-stone-800 sm:text-[1.25rem]">
              {wellness.title}
            </h3>
            <ul className="mt-5 space-y-4 font-sans text-[13.5px] font-light leading-[1.8] text-stone-600">
              <li>
                <span className="font-medium text-stone-700">起居情志 · </span>
                {wellness.advice}
              </li>
              <li>
                <span className="font-medium text-stone-700">膳食示意 · </span>
                {wellness.diet}
              </li>
              <li>
                <span className="font-medium text-stone-700">日常节律 · </span>
                {wellness.routine}
              </li>
            </ul>
            <p className="mt-6 border-t border-stone-200/60 pt-4 font-sans text-[11px] leading-relaxed text-stone-400">
              全站皮肤随四时（春/夏/秋/冬）与主题变量联动；文意为科普示意，具体诊疗请遵医嘱。
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
