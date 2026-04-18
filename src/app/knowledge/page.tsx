import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "知识库 · 黄岐智鉴",
  description: "方药、典籍与术语索引占位；可后续对接检索服务或静态语料。",
};

export default function KnowledgePage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-foreground">
          <BookOpen className="size-5 text-season-accent" aria-hidden />
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">知识库</h1>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Knowledge Base · Read models TBD
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          此路由预留为术语、方剂与文献的统一检索入口；与临床决策、体质辨识模块解耦。
        </p>
      </header>
      <div className="glass-panel flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
        <p className="max-w-md leading-relaxed">索引与图谱数据就绪后，可在此挂载搜索、过滤与引用卡片。</p>
      </div>
    </div>
  );
}
