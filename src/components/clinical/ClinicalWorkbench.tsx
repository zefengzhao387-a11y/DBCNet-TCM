"use client";

import { Loader2, Stethoscope } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IntegrationDetails } from "@/components/shell/IntegrationDetails";
import { requestClinicalInference } from "@/lib/api/clinical-inference";
import { hasPublicApiOrigin } from "@/lib/api/public-origin";
import { cn } from "@/lib/utils";
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
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-2 lg:gap-8">
      <header className="shrink-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Stethoscope className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="font-serif text-2xl font-medium tracking-wide text-foreground sm:text-[1.65rem]">
              临床决策支持
            </h1>
            <p className="text-sm text-muted-foreground">
              录入主诉与四诊信息，获取辨证叙事与证据链提示；结果仅供辅助参考。
            </p>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-gradient-to-b from-card/95 to-background/30 p-5 shadow-sm sm:p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint" className="text-foreground">
                主诉与现病史
              </Label>
              <textarea
                id="chiefComplaint"
                name="chiefComplaint"
                required
                rows={5}
                value={chiefComplaint}
                onChange={(ev) => setChiefComplaint(ev.target.value)}
                placeholder="请尽量按时间顺序描述：起病、性质、加重或缓解因素、伴随症状…"
                className="w-full resize-y rounded-2xl border border-input/80 bg-background/50 px-4 py-3 text-sm leading-[1.75] text-foreground outline-none ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fourNotes" className="text-foreground">
                四诊摘要 <span className="font-normal text-muted-foreground">（可选）</span>
              </Label>
              <textarea
                id="fourNotes"
                name="fourNotes"
                rows={4}
                value={fourNotes}
                onChange={(ev) => setFourNotes(ev.target.value)}
                placeholder="望诊、闻诊、问诊、切诊要点…"
                className="w-full resize-y rounded-2xl border border-input/80 bg-background/50 px-4 py-3 text-sm leading-[1.75] text-foreground outline-none ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="h-12 rounded-2xl text-[15px] shadow-sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  正在生成…
                </>
              ) : (
                "生成辨证参考"
              )}
            </Button>
          </form>

          <IntegrationDetails title="开发者 · 接口与字段">
            <p>
              推理端点：<code className="rounded bg-muted/80 px-1">POST /v1/clinical/inference</code>
              ，JSON 字段 <code className="rounded bg-muted/80 px-1">chiefComplaint</code>、
              <code className="rounded bg-muted/80 px-1">fourExaminationsNotes</code>。
            </p>
            <p className="mt-2">
              响应中可携带 <code className="rounded bg-muted/80 px-1">evidenceGraph</code> 供右侧「XAI
              溯源」面板渲染。
            </p>
            <p className="mt-2">
              <code className="rounded bg-muted/80 px-1">NEXT_PUBLIC_API_BASE</code>{" "}
              {hasPublicApiOrigin() ? "已配置。" : "未配置时为本地演示。"}
            </p>
          </IntegrationDetails>
        </div>

        <div className="flex min-h-[min(24rem,50dvh)] flex-col lg:col-span-7">
          <div
            className={cn(
              "flex flex-1 flex-col rounded-3xl border border-border/60 p-5 sm:p-6",
              result
                ? "bg-gradient-to-br from-card via-card to-primary/[0.03]"
                : "border-dashed bg-muted/15",
            )}
          >
            {!result ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
                <div className="rounded-full border border-border/60 bg-background/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  输出预览
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  提交后，辨证叙事、证候标签与图谱摘要将显示在此；宽屏下与左侧表单并排，便于对照阅读。
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
                <h2 className="font-serif text-lg font-medium text-foreground">辨证参考</h2>
                <p className="whitespace-pre-wrap text-sm leading-[1.85] text-foreground/90">
                  {result.narrative}
                </p>
                {result.syndromeLabels?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {result.syndromeLabels.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                {result.evidenceGraph?.nodes?.length ? (
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      证据链节点
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/85">
                      {result.evidenceGraph.nodes.map((n) => (
                        <li key={n.id} className="flex items-center gap-2">
                          <span className="size-1.5 shrink-0 rounded-full bg-season-accent" />
                          <span>{n.label}</span>
                          {n.role ? (
                            <span className="text-xs text-muted-foreground">（{n.role}）</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
