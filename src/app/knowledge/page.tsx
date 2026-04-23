import type { Metadata } from "next";
import { BookOpen, Library, Search } from "lucide-react";

import { KnowledgeBookmarkStrip } from "@/components/knowledge/KnowledgeBookmarkStrip";
import { ModuleHeader } from "@/components/shell/ModuleHeader";

export const metadata: Metadata = {
  title: "知识库 · 岐黄智诊",
  description: "方药、典籍与术语索引占位；可后续对接检索服务或静态语料。",
};

export default function KnowledgePage() {
  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-8">
      <ModuleHeader
        icon={BookOpen}
        title="知识库"
        description="方剂、经络与术语的检索入口（建设中）。"
        badge="Core"
      />

      <section className="module-card relative overflow-hidden p-2">
        <div className="pointer-events-none absolute -right-8 -top-12 size-40 rounded-full bg-primary/[0.07] blur-2xl" aria-hidden />
        <div className="module-card-soft relative p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
            <div className="h-14 w-full rounded-2xl border border-input/60 bg-muted/20 pl-12 pr-4 text-sm leading-[3.5rem] text-muted-foreground">
              搜索方药、穴位、病证术语…
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">接入检索服务后，此处将支持拼音、同义词与图谱跳转。</p>
        </div>
      </section>

      <section className="module-card p-6">
        <KnowledgeBookmarkStrip />
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="module-card-soft p-6 transition hover:-translate-y-1 hover:shadow-xl">
          <Library className="mb-3 size-8 text-season-accent/80" aria-hidden />
          <h2 className="font-medium text-foreground">典籍与方论</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">条文对照、方剂化裁与注释版本管理。</p>
        </div>
        <div className="module-card-soft p-6 transition hover:-translate-y-1 hover:shadow-xl">
          <BookOpen className="mb-3 size-8 text-season-accent/80" aria-hidden />
          <h2 className="font-medium text-foreground">术语与图谱</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">证候—症状—方药关联的可视化浏览。</p>
        </div>
      </section>
    </div>
  );
}
