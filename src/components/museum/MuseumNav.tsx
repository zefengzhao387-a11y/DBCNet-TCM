"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const links = [
  { href: "#hero", label: "首页", emphasis: false },
  { href: "#daily-season", label: "时令", emphasis: false },
  { href: "/login", label: "智能问诊", emphasis: false },
  { href: "#modules", label: "百科", emphasis: false },
  { href: "/login", label: "登录", emphasis: true },
] as const;

export function MuseumNav({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "museum-glass-nav fixed left-1/2 top-6 z-[60] flex w-[min(94vw,48rem)] -translate-x-1/2 items-center justify-between gap-4 rounded-full px-5 py-2.5 sm:px-6",
        className,
      )}
    >
      <Link
        href="#hero"
        className="group flex items-baseline gap-0.5 font-serif text-[13px] font-medium tracking-[0.12em] text-stone-800 transition hover:text-stone-950"
      >
        <span>DBCNet</span>
        <span className="text-[10px] text-stone-300 transition group-hover:text-stone-400">
          ·
        </span>
        <span className="text-[11px] tracking-[0.18em] text-stone-500 transition group-hover:text-stone-600">
          TCM
        </span>
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-0.5 font-sans text-[12.5px] font-medium tracking-[0.04em] text-stone-500 sm:gap-1 sm:text-[13px]">
        {links.map(({ href, label, emphasis }) =>
          href.startsWith("/") ? (
            <Link
              key={`${href}-${label}`}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 transition duration-200 sm:px-3.5",
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
              className="rounded-full px-3 py-1.5 text-stone-500 transition duration-200 hover:bg-stone-100/80 hover:text-stone-800 sm:px-3.5"
            >
              {label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}
