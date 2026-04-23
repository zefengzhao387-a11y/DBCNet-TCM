"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  CalendarDays,
  Leaf,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";
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
  /** 避免 SSR 与客户端时区/日期不一致导致 hydration 失败 */
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const {
    season,
    seasonZh,
    label,
    themeSkinLabel,
    calendarSeasonHint,
  } = useSeasonTheme();

  const daily = now ? getDailyTcmForDate(now) : null;
  const solar = now ? getSolarTermName(now) : null;
  const wellness = SEASONAL_WELLNESS[season];

  return (
    <section
      id="home-bento"
      className="relative z-10 scroll-mt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-20 pt-12 sm:pb-24 sm:pt-16 lg:scroll-mt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))]"
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground lg:hidden">
              Rhythm · 时令场域
            </p>
            <div className="scrollbar-hide -mx-1 flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-0.5 font-sans text-[12px] text-muted-foreground sm:text-[13px] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300/85 bg-white/78 px-3 py-1.5 shadow-sm dark:border-stone-500/40 dark:bg-stone-900/50 sm:py-1">
                <CalendarDays className="size-3.5 text-muted-foreground" aria-hidden />
                <span className="text-foreground/90" suppressHydrationWarning>
                  {now ? formatZhCalendar(now) : "载入本机日期…"}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300/85 bg-white/78 px-3 py-1.5 shadow-sm dark:border-stone-500/40 dark:bg-stone-900/50 sm:py-1">
                <Sparkles className="size-3.5 text-[color-mix(in_srgb,var(--season-accent)_52%,#6b6560)]" aria-hidden />
                节气（公历近似）·{" "}
                <strong className="font-medium text-foreground" suppressHydrationWarning>
                  {solar ?? "…"}
                </strong>
              </span>
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-1.5 lg:max-w-sm lg:items-end">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              四时 · 界面主题
            </p>
            <p className="text-left font-serif text-[15px] font-medium tracking-[0.06em] text-foreground lg:text-right">
              当前为 <strong className="text-[color-mix(in_srgb,var(--season-accent)_65%,#b8b0a0)] dark:text-[color-mix(in_srgb,var(--season-accent)_70%,#d4ccc0)]">{seasonZh}</strong>
              季 · {label}
            </p>
            <p className="max-w-md text-left font-sans text-[12px] leading-relaxed text-muted-foreground sm:text-[12.5px] lg:text-right">
              主题皮肤：<span className="font-medium text-foreground">{themeSkinLabel}</span>
            </p>
            <p className="max-w-md text-left font-sans text-[11px] leading-relaxed text-muted-foreground/90 lg:text-right">
              {calendarSeasonHint}
            </p>
          </div>
        </motion.div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <motion.article
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.78, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="museum-glass-card relative flex min-h-[min(22rem,52vh)] min-w-0 flex-col rounded-[2rem] p-6 sm:p-8 md:col-span-7 md:row-span-2"
          >
            <div className="mb-5 flex min-w-0 items-center justify-between gap-3 border-b border-border/50 pb-4">
              <div className="flex min-w-0 items-center gap-2">
                <BookMarked className="size-4 shrink-0 text-[color-mix(in_srgb,var(--season-accent)_48%,#78716c)]" aria-hidden />
                <h2 className="font-serif text-lg font-medium tracking-[0.12em] text-foreground">
                  每日一词
                </h2>
              </div>
              {daily ? (
                <FavoriteStarButton
                  className="shrink-0 text-muted-foreground hover:bg-white/50 dark:hover:bg-stone-800/60"
                  item={{
                    id: `term-${encodeURIComponent(daily.term)}`,
                    kind: "term",
                    title: daily.term,
                    subtitle: daily.gloss.slice(0, 72),
                    tags: ["每日一词", seasonZh],
                  }}
                  label="收藏词条"
                />
              ) : (
                <span className="inline-flex size-10 shrink-0" aria-hidden />
              )}
            </div>
            <p className="font-serif text-[clamp(1.75rem,4vw,2.35rem)] font-medium tracking-[0.14em] text-foreground">
              {daily?.term ?? "…"}
            </p>
            {daily?.reading ? (
              <p className="mt-2 font-sans text-[13px] text-muted-foreground">{daily.reading}</p>
            ) : null}
            <p className="mt-5 flex-1 font-sans text-[14px] font-light leading-[1.85] text-muted-foreground">
              {daily?.gloss ?? "正在载入当日词条…"}
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.78, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="museum-glass-card relative flex min-h-[13.5rem] min-w-0 flex-col rounded-[1.75rem] p-6 sm:p-7 md:col-span-5 md:row-start-1"
          >
            <div className="mb-4 flex min-w-0 items-center gap-2 border-b border-border/50 pb-3">
              <Leaf className="size-4 shrink-0 text-[color-mix(in_srgb,var(--season-accent)_48%,#78716c)]" aria-hidden />
              <h2 className="font-serif text-lg font-medium tracking-[0.12em] text-foreground">
                时令养生
              </h2>
            </div>
            <h3 className="font-serif text-[1.05rem] font-medium leading-snug text-foreground sm:text-[1.15rem]">
              {wellness.title}
            </h3>
            <p className="mt-3 line-clamp-3 font-sans text-[13px] font-light leading-[1.75] text-muted-foreground">
              <span className="font-medium text-foreground/90">起居 · </span>
              {wellness.advice}
            </p>
            <p className="mt-2 line-clamp-2 font-sans text-[12.5px] font-light leading-[1.7] text-muted-foreground">
              <span className="font-medium text-foreground/85">膳食 · </span>
              {wellness.diet}
            </p>
          </motion.article>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.78, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 md:col-start-8 md:row-start-2"
          >
            <Link
              href="/constitution"
              className="museum-glass-card group flex min-h-[13.5rem] h-full flex-col justify-between rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-0.5 sm:p-7"
            >
              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  体质测算
                </p>
                <h3 className="mt-3 font-serif text-[1.35rem] font-medium tracking-[0.1em] text-foreground sm:text-[1.5rem]">
                  舌象 + 问卷
                </h3>
                <p className="mt-2 max-w-[14rem] font-sans text-[13px] font-light leading-relaxed text-muted-foreground">
                  多模态体质辨识入口，结果可与智诊辅助结果联动（示意）。
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] font-medium text-[color-mix(in_srgb,var(--season-accent)_70%,#a3a39a)]">
                进入工作台
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </Link>
          </motion.div>
        </div>

        <p className="mt-8 max-w-3xl font-sans text-[11px] leading-relaxed text-muted-foreground/80">
          全站皮肤随四时与主题变量联动；文意为科普示意，具体诊疗请遵医嘱。
        </p>
      </div>
    </section>
  );
}
