"use client";

import { ArrowLeft, ArrowRight, Camera, Check, Loader2, Sparkles, Upload } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { IntegrationDetails } from "@/components/shell/IntegrationDetails";
import { requestConstitutionScreening } from "@/lib/api/constitution-screening";
import { hasPublicApiOrigin } from "@/lib/api/public-origin";
import { cn } from "@/lib/utils";
import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function LikertRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/50 bg-background/40 p-4 sm:p-5">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <div className="flex gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "h-11 min-w-0 flex-1 rounded-xl text-sm font-semibold tabular-nums transition sm:h-12",
              value === n
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-center text-[11px] text-muted-foreground">1 几乎没有 · 5 非常明显</p>
    </div>
  );
}

export function ConstitutionWorkbench() {
  const inputId = useId();
  const [phase, setPhase] = useState<"wizard" | "result">("wizard");
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [energy, setEnergy] = useState(3);
  const [coldIntolerance, setColdIntolerance] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [digestion, setDigestion] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConstitutionScreeningResponse | null>(null);
  const previewUrl = useObjectUrl(file);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) setFile(f);
  }, []);

  function resetAll() {
    setPhase("wizard");
    setWizardStep(1);
    setFile(null);
    setResult(null);
    setError(null);
    setEnergy(3);
    setColdIntolerance(3);
    setSleep(3);
    setDigestion(3);
  }

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const data = await requestConstitutionScreening(file, {
        answers: {
          energy_level: energy,
          cold_intolerance: coldIntolerance,
          sleep_quality: sleep,
          digestion_discomfort: digestion,
        },
      });
      setResult(data);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["舌象", "量表", "报告"] as const;
  const currentStepIndex = phase === "result" ? 2 : wizardStep - 1;

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-3xl flex-col gap-6 overflow-y-auto pb-2 lg:max-w-5xl">
      <header className="shrink-0 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Camera className="size-5" aria-hidden />
              </span>
              <div>
                <h1 className="font-serif text-2xl font-medium tracking-wide text-foreground sm:text-[1.65rem]">
                  体质辨识
                </h1>
                <p className="text-sm text-muted-foreground">
                  舌象与问卷结合，生成倾向性参考（非医疗诊断）。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 步骤条 */}
        <div className="flex items-center gap-2 sm:gap-3" aria-hidden>
          {stepLabels.map((label, i) => {
            const done = i < currentStepIndex;
            const current = i === currentStepIndex;
            return (
              <div key={label} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                      done && "bg-primary text-primary-foreground",
                      current && !done && "bg-foreground text-background ring-2 ring-primary/25",
                      !done && !current && "border border-border/80 bg-muted/30 text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden truncate text-xs font-medium uppercase tracking-wider sm:inline sm:text-[11px]",
                      current ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 ? (
                  <div
                    className={cn(
                      "h-px min-w-[1rem] flex-1 rounded-full",
                      i < currentStepIndex ? "bg-primary/40" : "bg-border/80",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </header>

      {phase === "wizard" ? (
        <>
          {wizardStep === 1 ? (
            <section className="shrink-0 space-y-4">
              <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-card/90 to-background/40 p-1 shadow-sm sm:p-2">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById(inputId)?.click();
                    }
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className={cn(
                    "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition sm:min-h-[260px]",
                    dragOver
                      ? "border-primary/60 bg-primary/[0.06]"
                      : "border-border/70 bg-muted/10 hover:border-primary/35 hover:bg-muted/20",
                  )}
                  onClick={() => document.getElementById(inputId)?.click()}
                >
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
                  />
                  {previewUrl ? (
                    <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border border-border/60 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element -- 本地 blob 预览 */}
                      <img src={previewUrl} alt="舌象预览" className="size-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-background/80 shadow-sm ring-1 ring-border/60">
                        <Upload className="size-6 text-muted-foreground" aria-hidden />
                      </div>
                      <p className="text-center font-medium text-foreground">上传或拍摄舌象</p>
                      <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                        自然光下张口伸舌，镜头与舌体平齐；可拖拽图片到此处。
                      </p>
                    </>
                  )}
                </div>
              </div>
              <ul className="grid gap-2 text-xs leading-relaxed text-muted-foreground sm:grid-cols-3">
                <li className="rounded-xl bg-muted/25 px-3 py-2">避免刚进食有色饮料后拍摄</li>
                <li className="rounded-xl bg-muted/25 px-3 py-2">勿过度用力伸舌以免舌质失真</li>
                <li className="rounded-xl bg-muted/25 px-3 py-2">舌象为可选项，亦可仅填量表</li>
              </ul>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 rounded-2xl px-6"
                  onClick={() => setWizardStep(2)}
                >
                  下一步
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </section>
          ) : (
            <section className="shrink-0 space-y-5">
              <LikertRow
                label="近期是否容易疲乏？"
                hint="指体力或精神不振、恢复慢的主观感受。"
                value={energy}
                onChange={setEnergy}
              />
              <LikertRow
                label="是否比旁人更怕冷？"
                hint="在相同环境下畏寒、喜暖的程度。"
                value={coldIntolerance}
                onChange={setColdIntolerance}
              />
              <LikertRow
                label="睡眠是否易浅、多梦或难入睡？"
                hint="以近两周整体情况为准。"
                value={sleep}
                onChange={setSleep}
              />
              <LikertRow
                label="脘腹是否常有不适（胀、满、隐痛）？"
                hint="与饮食或情绪相关的胃肠主观不适。"
                value={digestion}
                onChange={setDigestion}
              />

              {error ? (
                <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-2xl px-4"
                  onClick={() => setWizardStep(1)}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  上一步
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  className="h-12 rounded-2xl px-8 shadow-sm"
                  onClick={() => void onSubmit()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                      分析中…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 size-4" aria-hidden />
                      生成体质报告
                    </>
                  )}
                </Button>
              </div>
            </section>
          )}

          <IntegrationDetails>
            <p>
              已配置公网地址时，请求 <code className="rounded bg-muted/80 px-1">POST /v1/constitution/screening</code>{" "}
             （multipart：<code className="rounded bg-muted/80 px-1">tongue_image</code>、
              <code className="rounded bg-muted/80 px-1">questionnaire</code> JSON）。
            </p>
            <p className="mt-2">
              环境变量 <code className="rounded bg-muted/80 px-1">NEXT_PUBLIC_API_BASE</code>{" "}
              {hasPublicApiOrigin() ? "已设置。" : "未设置时当前为本地演示数据。"}
            </p>
          </IntegrationDetails>
        </>
      ) : result ? (
        <section className="space-y-6 rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground">您的体质倾向</h2>
              <p className="mt-1 text-sm text-muted-foreground">以下为模型综合舌象与量表的示意输出。</p>
            </div>
            <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={resetAll}>
              重新测评
            </Button>
          </div>

          <ul className="space-y-4">
            {result.constitutionTypes.map((c, idx) => {
              const pct = c.score <= 1 ? c.score * 100 : c.score;
              return (
                <li key={c.code} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={cn("font-medium", idx === 0 && "text-foreground")}>{c.label}</span>
                    <span className="tabular-nums text-muted-foreground">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-[width] duration-700 ease-out"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl border border-border/50 bg-background/50 p-4 sm:p-5">
            <p className="whitespace-pre-wrap text-sm leading-[1.85] text-foreground/90">{result.narrative}</p>
          </div>

          {result.cautions?.length ? (
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 text-xs leading-relaxed text-amber-950/90 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100/90">
              {result.cautions.map((c) => (
                <p key={c}>{c}</p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
