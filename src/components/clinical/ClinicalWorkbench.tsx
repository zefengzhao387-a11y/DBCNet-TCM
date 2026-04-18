"use client";

import { Loader2, Stethoscope } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { requestClinicalInference } from "@/lib/api/clinical-inference";
import { hasPublicApiOrigin } from "@/lib/api/public-origin";
import type { ClinicalInferenceResponse } from "@/types/clinical-inference";

export function ClinicalWorkbench() {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [fourNotes, setFourNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClinicalInferenceResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await requestClinicalInference({
        chiefComplaint: chiefComplaint.trim(),
        fourExaminationsNotes: fourNotes.trim() || undefined,
        locale: "zh-CN",
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
      <header className="shrink-0 space-y-1">
        <div className="flex items-center gap-2 text-foreground">
          <Stethoscope className="size-5 text-season-accent" aria-hidden />
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">临床决策支持</h1>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Clinical Decision Support · POST /v1/clinical/inference
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          面向 DBCNet 双分支推理接口的录入与结果区；可解释图谱建议写入响应体的{" "}
          <code className="rounded bg-muted/80 px-1 py-0.5 text-xs">evidenceGraph</code>{" "}
          并由右侧 XAI 面板渲染。
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="glass-panel shrink-0 space-y-4 rounded-2xl border p-4 sm:p-5"
      >
        <div className="space-y-2">
          <Label htmlFor="chiefComplaint">主诉与现病史</Label>
          <textarea
            id="chiefComplaint"
            name="chiefComplaint"
            required
            rows={4}
            value={chiefComplaint}
            onChange={(ev) => setChiefComplaint(ev.target.value)}
            placeholder="示例：反复胃脘隐痛 2 周，食后加重…"
            className="w-full resize-y rounded-xl border border-input/80 bg-background/40 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fourNotes">四诊摘要（可选）</Label>
          <textarea
            id="fourNotes"
            name="fourNotes"
            rows={3}
            value={fourNotes}
            onChange={(ev) => setFourNotes(ev.target.value)}
            placeholder="望闻问切要点…"
            className="w-full resize-y rounded-xl border border-input/80 bg-background/40 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading} className="h-11 rounded-xl px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                推理中…
              </>
            ) : (
              "提交推理"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            API：{hasPublicApiOrigin() ? "已配置 NEXT_PUBLIC_API_BASE" : "本地演示（无后端）"}
          </p>
        </div>
      </form>

      {error ? (
        <p className="shrink-0 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {result ? (
        <section className="glass-panel min-h-0 flex-1 space-y-3 rounded-2xl border p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-foreground">模型输出</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {result.narrative}
          </p>
          {result.syndromeLabels?.length ? (
            <div className="flex flex-wrap gap-2">
              {result.syndromeLabels.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {result.evidenceGraph?.nodes?.length ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-background/30 p-3 text-xs text-muted-foreground">
              <p className="mb-2 font-medium text-foreground/80">图谱摘要（供 XAI 消费）</p>
              <ul className="list-inside list-disc space-y-0.5">
                {result.evidenceGraph.nodes.map((n) => (
                  <li key={n.id}>
                    {n.label}
                    {n.role ? ` · ${n.role}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
