"use client";

import { MapPinned } from "lucide-react";
import Link from "next/link";

import { DbcnetMark } from "@/components/brand/DbcnetMark";
import { ZenModeToggle } from "@/components/zen/ZenModeToggle";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { cn } from "@/lib/utils";

const links = [
  { href: "#hero", label: "首页", emphasis: false },
  { href: "#daily-season", label: "时令", emphasis: false },
  { href: "/clinical", label: "临床决策", emphasis: false },
  { href: "/constitution", label: "体质辨识", emphasis: false },
  { href: "/knowledge", label: "知识库", emphasis: false },
] as const;

/**
 * 顶栏：品牌（Logo + 标题）固定在视口左上方并放大；中央玻璃位放主导航与副线文案。
 * 窄屏不重复顶栏内链，由 `MuseumMobileDock` 承担快捷导航，中部只展示短说明。
 */
export function MuseumNav({ className }: { className?: string }) {
  const { label, themeSkinLabel } = useSeasonTheme();

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] museum-gutter-x pt-[max(0.75rem,env(safe-area-inset-top,0px))] lg:pt-[max(1.5rem,env(safe-area-inset-top,0px))]",
        className,
      )}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[min(100%,120rem)] min-h-[3.5rem] items-center gap-1.5 sm:min-h-[4.25rem] sm:gap-3">
        {/* 左上：品牌主标识（放大、显眼） */}
        <div className="min-w-0 shrink-0 pr-0.5 -ml-1.5 sm:-ml-2 md:-ml-2.5">
          <Link
            href="#hero"
            className="group flex min-w-0 max-w-[calc(100dvw-8.5rem)] items-center gap-2.5 sm:max-w-[min(18rem,42vw)] sm:gap-3.5 sm:pr-1 md:max-w-none"
            title="回到首页"
            aria-label="岐黄智诊，回到首页"
          >
            <DbcnetMark
              className="!h-14 !w-14 !min-h-14 !min-w-14 sm:!h-[3.75rem] sm:!w-[3.75rem] md:!h-16 md:!w-16"
              sizes="(max-width: 640px) 112px, 128px"
              priority
              aria-hidden
            />
            <div className="min-w-0 text-left">
              <span className="block font-serif text-base font-medium leading-tight tracking-[0.1em] text-foreground sm:text-lg md:text-[1.4rem] md:tracking-[0.11em]">
                岐黄智诊
              </span>
              <span className="mt-0.5 line-clamp-1 block text-[0.5rem] font-medium tracking-[0.14em] text-muted-foreground sm:line-clamp-none sm:text-[0.6rem] sm:leading-snug sm:tracking-[0.15em]">
                DBCNet · 多模态中医智能辅助
              </span>
            </div>
          </Link>
        </div>

        {/* 中部：原「玻璃主导航带」— 宽屏为链接；窄屏为能力副线，避免与底栏重复一屏两套链接 */}
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center self-stretch pl-0.5 sm:pl-1">
          <div
            className={cn(
              "museum-glass-nav pointer-events-auto hidden w-full min-h-[2.75rem] max-w-[min(100%,40rem)] flex-1 items-stretch justify-center gap-0 rounded-2xl py-1.5 pl-2.5 pr-0 shadow-[0_12px_40px_rgba(42,50,44,0.07)] sm:rounded-3xl sm:pl-3",
              "md:min-h-[2.75rem] md:max-w-[min(100%,40rem)] md:rounded-full md:pl-3.5",
              "lg:max-w-[min(100%,50rem)] lg:min-h-[2.9rem] lg:gap-2 lg:py-2.5",
              "lg:flex lg:flex-row lg:items-center",
            )}
          >
            <div
              className="flex w-[min(100%,10.5rem)] shrink-0 flex-col justify-center border-r border-border/60 py-0.5 pr-2.5"
              title={themeSkinLabel}
            >
              <p className="text-[9px] font-medium leading-none tracking-[0.16em] text-muted-foreground">
                展厅导览
              </p>
              <div className="mt-1 flex min-w-0 items-center gap-1.5">
                <MapPinned
                  className="size-3.5 shrink-0 text-[color-mix(in_srgb,var(--season-accent)_52%,#78716c)] sm:size-4"
                  aria-hidden
                />
                <p className="min-w-0 font-serif text-xs font-medium leading-tight tracking-[0.05em] text-foreground sm:text-[0.8125rem]">
                  {label}
                </p>
              </div>
            </div>
            <nav
              aria-label="博物馆主导航"
              className="scrollbar-hide flex min-h-0 w-full min-w-0 flex-1 flex-wrap items-center justify-end gap-0.5 pl-0.5 pr-1.5 font-sans text-[10.5px] font-medium tracking-[0.03em] text-muted-foreground sm:gap-1.5 sm:pl-1.5 sm:text-xs md:gap-1.5 md:text-[12.5px] md:tracking-[0.04em] lg:justify-end lg:gap-1.5 lg:pr-2.5 lg:text-[13px]"
            >
              {links.map(({ href, label }) =>
                href.startsWith("/") ? (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "inline-flex min-h-9 shrink-0 touch-manipulation items-center justify-center rounded-full px-2 py-1.5 text-muted-foreground transition duration-200 hover:bg-muted/60 hover:text-foreground sm:min-h-0 sm:px-2.5 sm:py-2.5",
                      "md:px-3 md:py-1.5",
                      label === "临床决策" ? "hidden min-[400px]:inline-flex" : null,
                    )}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex min-h-9 shrink-0 touch-manipulation items-center justify-center rounded-full px-2 py-1.5 text-muted-foreground transition duration-200 hover:bg-muted/60 hover:text-foreground sm:min-h-0 sm:px-2.5 sm:py-2.5 md:px-3 md:py-1.5"
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>
          </div>
          <p
            className="-mx-0.5 min-w-0 max-w-full flex-1 text-center text-[0.5rem] font-medium leading-tight tracking-[0.1em] text-muted-foreground [text-wrap:balance] min-[400px]:text-[0.55rem] sm:mx-0 sm:max-w-[min(100%,18rem)] sm:text-xs sm:leading-snug lg:hidden"
            title="多模态中医：临床与体质、知识、时令、膳食等场景"
          >
            临床与体质
            <span className="text-muted-foreground/40">·</span>
            知识与时令
            <span className="text-muted-foreground/40">·</span>
            一站随览
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <ZenModeToggle withLabel size="md" />
          <div className="museum-liquid-login-shell">
          <span className="museum-liquid-login-blob museum-liquid-login-blob-a" aria-hidden />
          <span className="museum-liquid-login-blob museum-liquid-login-blob-b" aria-hidden />
          <Link
            href="/login"
            className="museum-liquid-login-link text-foreground relative z-[1] inline-flex min-h-[40px] min-w-[3.5rem] items-center justify-center rounded-full px-3.5 py-1.5 font-sans text-[12px] font-semibold tracking-wide transition duration-300 hover:text-foreground/90 sm:min-h-[44px] sm:min-w-[4.5rem] sm:px-4 sm:py-2 sm:text-[12.5px]"
          >
            登录
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
