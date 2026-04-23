"use client";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";

const SAMPLES = [
  {
    id: "kw-君臣佐使",
    title: "君臣佐使",
    desc: "方剂配伍结构：主药为君，辅臣佐使各司其职。",
  },
  {
    id: "kw-四气五味",
    title: "四气五味",
    desc: "寒热温凉与酸苦甘辛咸，指导性味配伍与食疗。",
  },
  {
    id: "kw-子午流注",
    title: "子午流注",
    desc: "气血盛衰随十二时辰起伏，可参作息与针灸取穴。",
  },
] as const;

export function KnowledgeBookmarkStrip() {
  return (
    <div className="space-y-3">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        可收 · 术语卡
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {SAMPLES.map((row) => (
          <li
            key={row.id}
            className="module-card-soft flex flex-col gap-2 p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-serif text-[15px] font-medium tracking-[0.08em] text-foreground">
                {row.title}
              </p>
              <FavoriteStarButton
                className="-mr-1 -mt-1 shrink-0"
                size="sm"
                item={{
                  id: row.id,
                  kind: "knowledge",
                  title: row.title,
                  subtitle: row.desc,
                  tags: ["知识库"],
                }}
                label="收藏术语"
              />
            </div>
            <p className="font-sans text-[12.5px] leading-relaxed text-muted-foreground">
              {row.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
