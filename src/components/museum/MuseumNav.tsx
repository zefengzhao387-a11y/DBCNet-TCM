"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const links = [
  { href: "#hero", label: "首页", emphasis: false },
  { href: "#daily-season", label: "时令", emphasis: false },
  { href: "/clinical", label: "临床决策", emphasis: false },
  { href: "/constitution", label: "体质辨识", emphasis: false },
  { href: "/knowledge", label: "知识库", emphasis: false },
] as const;

export function MuseumNav({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] museum-gutter-x pt-[max(0.75rem,env(safe-area-inset-top,0px))] lg:pt-[max(1.5rem,env(safe-area-inset-top,0px))]",
        className,
      )}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[min(100%,120rem)] items-center justify-between gap-2 sm:gap-3">
        {/* 与右侧登录区对称，大屏下让中央胶囊视觉居中 */}
        <div
          className="hidden w-[5.5rem] shrink-0 lg:block"
          aria-hidden
        />

        <div className="flex min-w-0 flex-1 justify-center">
          <header
            className={cn(
              "museum-glass-nav flex w-[min(13.5rem,calc(100dvw_-_5.5rem_-_env(safe-area-inset-left,0px)_-_env(safe-area-inset-right,0px)))] max-w-full items-center justify-center rounded-full px-5 py-2.5 shadow-[0_12px_40px_rgba(42,50,44,0.07)] max-lg:shadow-[0_12px_40px_rgba(42,50,44,0.07)]",
              "lg:w-[min(48rem,calc(100dvw_-_11rem_-_env(safe-area-inset-left,0px)_-_env(safe-area-inset-right,0px)))] lg:justify-between lg:gap-4 lg:rounded-full lg:px-6 lg:py-2.5",
            )}
          >
            <Link
              href="#hero"
              className="group flex shrink-0 items-baseline gap-0.5 font-serif text-[13px] font-medium tracking-[0.12em] text-[#2c332f] transition hover:text-stone-900"
            >
              <span>岐黄智诊</span>
              <span className="text-[10px] text-stone-400 transition group-hover:text-stone-500">
                ·
              </span>
              <span className="text-[11px] tracking-[0.18em] text-stone-600 transition group-hover:text-stone-700">
                DBCNet
              </span>
            </Link>
            <nav
              aria-label="博物馆主导航"
              className="scrollbar-hide hidden min-h-[44px] min-w-0 flex-nowrap items-center gap-1 font-sans text-[12.5px] font-medium tracking-[0.04em] text-stone-600 lg:flex lg:justify-end lg:text-[13px]"
            >
              {links.map(({ href, label }) =>
                href.startsWith("/") ? (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full px-3.5 py-2.5 text-stone-600 transition duration-200 hover:bg-stone-100/85 hover:text-stone-900 sm:py-1.5",
                      label === "临床决策" ? "hidden xs:inline-flex" : null,
                    )}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full px-3.5 py-2.5 text-stone-600 transition duration-200 hover:bg-stone-100/85 hover:text-stone-900 sm:py-1.5"
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>
          </header>
        </div>

        <div className="museum-liquid-login-shell shrink-0">
          <span className="museum-liquid-login-blob museum-liquid-login-blob-a" aria-hidden />
          <span className="museum-liquid-login-blob museum-liquid-login-blob-b" aria-hidden />
          <Link
            href="/login"
            className="museum-liquid-login-link relative z-[1] inline-flex min-h-[44px] min-w-[4.5rem] items-center justify-center rounded-full px-4 py-2 font-sans text-[12.5px] font-semibold tracking-wide text-[#2f3832] transition duration-300 hover:text-stone-900"
          >
            登录
          </Link>
        </div>
      </div>
    </div>
  );
}
