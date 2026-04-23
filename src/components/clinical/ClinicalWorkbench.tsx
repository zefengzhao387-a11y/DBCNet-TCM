"use client";

import { ArrowUp, Download, Loader2, Stethoscope } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { PrescriptionScrollCard } from "@/components/clinical/PrescriptionScrollCard";
import { ClinicalHeirloomReport } from "@/components/reports/ClinicalHeirloomReport";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IntegrationDetails } from "@/components/shell/IntegrationDetails";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { requestClinicalInference } from "@/lib/api/clinical-inference";
import { hasPublicApiOrigin } from "@/lib/api/public-origin";
import {
  buildInterimGraphFromComplaint,
  graphFromInferenceResponse,
} from "@/lib/clinical-graph";
import { downloadElementAsPng } from "@/lib/heirloom-report";
import { cn } from "@/lib/utils";
import { useLogicGraphStore } from "@/stores/logic-graph-store";
import { useToast } from "@/stores/toast-store";
import { useUIStore } from "@/stores/ui-store";
import type { ClinicalInferenceResponse } from "@/types/clinical-inference";

export function ClinicalWorkbench() {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [fourNotes, setFourNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClinicalInferenceResponse | null>(null);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { themeSkinLabel } = useSeasonTheme();
  const graphNodes = useLogicGraphStore((s) => s.nodes);
  const setXaiOpen = useUIStore((s) => s.setXaiOpen);
  const setStreaming = useLogicGraphStore((s) => s.setStreaming);
  const setComplete = useLogicGraphStore((s) => s.setComplete);
  const { toast } = useToast();

  const seasonalHint = `${themeSkinLabel}；饮食有节，起居有常，情志舒畅为宜。`;

  useLayoutEffect(() => {
    setXaiOpen(true);
  }, [setXaiOpen]);

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      const s = useLogicGraphStore.getState();
      if (s.activeEdgeCount < s.edges.length) {
        s.revealNextEdge();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const cc = chiefComplaint.trim();
    setXaiOpen(true);
    const interim = buildInterimGraphFromComplaint(cc);
    setStreaming(interim.nodes, interim.edges);
    setLoading(true);
    try {
      const data = await requestClinicalInference({
        chiefComplaint: cc,
        fourExaminationsNotes: fourNotes.trim() || undefined,
        locale: "zh-CN",
      });
      setResult(data);
      const g = graphFromInferenceResponse(data, cc);
      setComplete(g.nodes, g.edges);
      toast({
        tone: "success",
        title: "辨证结果已生成",
        description: "已更新叙事、方笺与逻辑链。",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
      setComplete(interim.nodes, interim.edges);
      toast({
        tone: "error",
        title: "生成失败",
        description: err instanceof Error ? err.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleHeirloomExport() {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await new Promise((r) => window.setTimeout(r, 500));
      await downloadElementAsPng(
        reportRef.current,
        `岐黄智诊-传家辨证笺-${new Date().toISOString().slice(0, 10)}.png`,
      );
      toast({
        tone: "success",
        title: "已导出传家报告",
      });
    } catch {
      toast({
        tone: "error",
        title: "导出失败",
        description: "请稍后再试。",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col gap-7 overflow-y-auto pb-6 lg:gap-10 lg:pb-10">
      <ModuleHeader
        icon={Stethoscope}
        title="智诊辅助"
        description="录入主诉与四诊信息，获取辨证叙事与证据链提示；结果仅供辅助参考。"
        badge="Core"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-xs"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="mr-1.5 size-4" />
            回顶部
          </Button>
        }
      />

      <div className="grid min-h-0 flex-1 gap-7 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <form
            onSubmit={onSubmit}
            className="module-card flex flex-col gap-5 p-5 sm:p-6"
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
                className="w-full resize-y rounded-2xl border border-input/80 bg-background/60 px-4 py-3 text-sm leading-[1.75] text-foreground outline-none ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
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
                className="w-full resize-y rounded-2xl border border-input/80 bg-background/60 px-4 py-3 text-sm leading-[1.75] text-foreground outline-none ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
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
              响应中可携带 <code className="rounded bg-muted/80 px-1">evidenceGraph</code> 供右侧「逻辑链」
              流光图谱渲染；<code className="rounded bg-muted/80 px-1">prescription</code>{" "}
              供中间手写方笺卡片展示。
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
              "flex flex-1 flex-col rounded-3xl border border-border/65 p-5 sm:p-6",
              result || loading
                ? "module-card"
                : "border-dashed bg-background/45",
            )}
          >
            {!result && !loading ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
                <div className="rounded-full border border-border/60 bg-background/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  输出预览
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  提交后，辨证叙事、手书方笺与右侧逻辑链将同步呈现；宽屏下可并排对照阅读。
                </p>
              </div>
            ) : null}
            {loading && !result ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
                <Loader2
                  className="size-10 animate-spin text-primary"
                  aria-hidden
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    正在合参辨证…
                  </p>
                  <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                    右侧「逻辑链」已根据主诉开始推演连线；流光将随推理步骤逐条点亮。
                  </p>
                </div>
              </div>
            ) : null}
            {result ? (
              <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-serif text-lg font-medium text-foreground">辨证参考</h2>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-10 rounded-xl gap-2"
                    disabled={exporting}
                    onClick={() => void handleHeirloomExport()}
                  >
                    {exporting ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <Download className="size-4" aria-hidden />
                    )}
                    传家报告长图
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-[1.85] text-foreground/90">
                  {result.narrative}
                </p>
                {result.prescription?.lines?.length ? (
                  <PrescriptionScrollCard
                    title={result.prescription.title}
                    lines={result.prescription.lines}
                    sealNumber={result.prescription.sealNumber}
                    favorite={{
                      id: `rx-${result.prescription.lines.map((l) => l.herb).join("-")}`,
                      kind: "formula",
                      title: result.prescription.title ?? "辨证方意",
                      subtitle: result.syndromeLabels?.join(" · "),
                      tags: result.syndromeLabels ?? [],
                    }}
                  />
                ) : null}
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
                <p className="text-xs leading-relaxed text-muted-foreground">
                  症状—证候—方药的连线与流光在右侧「逻辑链」面板；若未看到，请点击顶栏「逻辑链」展开。
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {result ? (
        <div
          className="pointer-events-none fixed left-[-10000px] top-0 z-[-1]"
          aria-hidden
        >
          <ClinicalHeirloomReport
            ref={reportRef}
            result={result}
            chiefComplaint={chiefComplaint}
            graphNodes={graphNodes}
            seasonalHint={seasonalHint}
          />
        </div>
      ) : null}
    </div>
  );
}
