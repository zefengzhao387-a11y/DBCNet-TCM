"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const links = [
  { href: "#hero", label: "首页", emphasis: false },
  { href: "#daily-season", label: "时令", emphasis: false },
  { href: "/clinical", label: "临床决策", emphasis: false },
  { href: "/constitution", label: "体质辨识", emphasis: false },
  { href: "/knowledge", label: "知识库", emphasis: false },
  { href: "/login", label: "登录", emphasis: true },
] as const;

export function MuseumNav({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "museum-glass-nav fixed left-1/2 z-[60] flex -translate-x-1/2 items-center justify-center rounded-full px-5 py-2.5",
        "top-[max(0.75rem,env(safe-area-inset-top,0px))] w-[min(13.5rem,calc(100dvw_-_2rem_-_env(safe-area-inset-left,0px)_-_env(safe-area-inset-right,0px)))] max-lg:shadow-[0_12px_40px_rgba(42,50,44,0.07)]",
        "lg:top-[max(1.5rem,env(safe-area-inset-top,0px))] lg:w-[min(48rem,calc(100dvw_-_1.25rem_-_env(safe-area-inset-left,0px)_-_env(safe-area-inset-right,0px)))] lg:justify-between lg:gap-4 lg:rounded-full lg:px-6 lg:py-2.5",
        className,
      )}
    >
      <Link
        href="#hero"
        className="group flex shrink-0 items-baseline gap-0.5 font-serif text-[13px] font-medium tracking-[0.12em] text-stone-800 transition hover:text-stone-950"
      >
        <span>岐黄智鉴</span>
        <span className="text-[10px] text-stone-300 transition group-hover:text-stone-400">
          ·
        </span>
        <span className="text-[11px] tracking-[0.18em] text-stone-500 transition group-hover:text-stone-600">
          DBCNet
        </span>
      </Link>
      <nav
        aria-label="博物馆主导航"
        className="scrollbar-hide hidden min-h-[44px] min-w-0 flex-nowrap items-center gap-1 font-sans text-[12.5px] font-medium tracking-[0.04em] text-stone-500 lg:flex lg:justify-end lg:text-[13px]"
      >
        {links.map(({ href, label, emphasis }) =>
          href.startsWith("/") ? (
            <Link
              key={`${href}-${label}`}
              href={href}
              className={cn(
                "inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full px-3.5 py-2.5 transition duration-200 sm:py-1.5",
                label === "临床决策" ? "hidden xs:inline-flex" : null,
                emphasis
                  ? "bg-stone-800/90 text-white shadow-sm hover:bg-stone-800"
                  : "text-stone-500 hover:bg-stone-100/80 hover:text-stone-800",
              )}
            >
              {label}
            </Link>
          ) : (
            <a
              key={href}
              href={href}
              className="inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full px-3.5 py-2.5 text-stone-500 transition duration-200 hover:bg-stone-100/80 hover:text-stone-800 sm:py-1.5"
            >
              {label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}
