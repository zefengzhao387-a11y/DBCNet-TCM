"use client";

import { motion } from "framer-motion";
import { BookMarked, ChefHat, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { FavoriteItem, FavoriteKind } from "@/stores/favorites-store";
import { useFavoritesStore } from "@/stores/favorites-store";

function kindIcon(kind: FavoriteKind) {
  switch (kind) {
    case "formula":
      return Sparkles;
    case "diet":
      return ChefHat;
    case "term":
    case "knowledge":
      return BookMarked;
    default:
      return Star;
  }
}

function kindLabel(kind: FavoriteKind): string {
  switch (kind) {
    case "formula":
      return "方意";
    case "diet":
      return "膳食";
    case "term":
      return "词条";
    case "knowledge":
      return "知识";
    default:
      return "收藏";
  }
}

function TimelineRow({
  item,
  last,
  onRemove,
}: {
  item: FavoriteItem;
  last: boolean;
  onRemove: () => void;
}) {
  const Icon = kindIcon(item.kind);
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-season-accent shadow-sm backdrop-blur-sm">
          <Icon className="size-5" strokeWidth={1.35} aria-hidden />
        </div>
        {!last ? (
          <div
            className="mt-2 w-px flex-1 min-h-[2.5rem] bg-gradient-to-b from-border via-border/50 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 min-w-0 flex-1 rounded-2xl border border-border/50 bg-gradient-to-br from-card/95 to-background/30 p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary">
            {kindLabel(item.kind)}
          </span>
          <time className="font-sans text-[11px] text-muted-foreground">{dateStr}</time>
        </div>
        <h2 className="mt-2 font-serif text-lg font-medium tracking-[0.08em] text-foreground">
          {item.title}
        </h2>
        {item.subtitle ? (
          <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
            {item.subtitle}
          </p>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-sans text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={onRemove}
          >
            移出时光轴
          </Button>
        </div>
      </motion.article>
    </div>
  );
}

export function FavoritesTimeline() {
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);
  const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-2xl flex-col gap-8 overflow-y-auto pb-4">
      <header className="shrink-0 space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Star className="size-5 fill-amber-400/30 text-amber-600" aria-hidden />
          </span>
          <div>
            <h1 className="font-serif text-2xl font-medium tracking-wide text-foreground sm:text-[1.65rem]">
              我的收藏
            </h1>
            <p className="text-sm text-muted-foreground">
              时光轴记录你点亮的方笺、词条与膳食灵感。
            </p>
          </div>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/70 bg-muted/10 px-6 py-16 text-center">
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            还没有收藏。去临床页、展厅「每日一词」或膳食卡片上，点一下星星试试吧。
          </p>
          <Button asChild variant="secondary" className="rounded-2xl">
            <Link href="/">回展厅逛逛</Link>
          </Button>
        </div>
      ) : (
        <div className="relative pl-1">
          {sorted.map((item, i) => (
            <TimelineRow
              key={item.id}
              item={item}
              last={i === sorted.length - 1}
              onRemove={() => remove(item.id)}
            />
          ))}
        </div>
      )}

      {sorted.length > 0 ? (
        <p className="text-center font-sans text-[11px] text-muted-foreground">
          点击条目可在未来版本联动详情（当前为本地示意）。
        </p>
      ) : null}
    </div>
  );
}
