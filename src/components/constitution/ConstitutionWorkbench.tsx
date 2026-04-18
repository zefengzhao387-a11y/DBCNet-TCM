"use client";

import { Camera, Loader2 } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { requestConstitutionScreening } from "@/lib/api/constitution-screening";
import { hasPublicApiOrigin } from "@/lib/api/public-origin";
import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";

export function ConstitutionWorkbench() {
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [energy, setEnergy] = useState("3");
  const [coldIntolerance, setColdIntolerance] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConstitutionScreeningResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await requestConstitutionScreening(file, {
        answers: {
          energy_level: Number(energy),
          cold_intolerance: Number(coldIntolerance),
        },
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
          <Camera className="size-5 text-season-accent" aria-hidden />
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">体质辨识</h1>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Constitution Screening · POST /v1/constitution/screening
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          舌象图像与量表答案以 multipart 提交；字段名{" "}
          <code className="rounded bg-muted/80 px-1 py-0.5 text-xs">tongue_image</code>、
          <code className="rounded bg-muted/80 px-1 py-0.5 text-xs">questionnaire</code>{" "}
          可与后端对齐后调整。
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="glass-panel shrink-0 space-y-5 rounded-2xl border p-4 sm:p-5"
      >
        <div className="space-y-2">
          <Label htmlFor={inputId}>舌象图像</Label>
          <input
            id={inputId}
            name="tongue"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-input file:bg-background file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground"
          />
          <p className="text-xs text-muted-foreground">
            建议在均匀自然光下、伸舌姿势稳定后拍摄；具体引导 UI 可对齐业务舌诊页流程。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="energy">乏力程度（1–5）</Label>
            <input
              id="energy"
              name="energy"
              type="number"
              min={1}
              max={5}
              value={energy}
              onChange={(ev) => setEnergy(ev.target.value)}
              className="h-11 w-full rounded-xl border border-input/80 bg-background/40 px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cold">畏寒程度（1–5）</Label>
            <input
              id="cold"
              name="cold"
              type="number"
              min={1}
              max={5}
              value={coldIntolerance}
              onChange={(ev) => setColdIntolerance(ev.target.value)}
              className="h-11 w-full rounded-xl border border-input/80 bg-background/40 px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading} className="h-11 rounded-xl px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                分析中…
              </>
            ) : (
              "提交辨识"
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
          <h2 className="text-sm font-semibold text-foreground">辨识结果</h2>
          <ul className="space-y-2">
            {result.constitutionTypes.map((c) => (
              <li
                key={c.code}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {(c.score <= 1 ? c.score * 100 : c.score).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {result.narrative}
          </p>
          {result.cautions?.length ? (
            <ul className="list-inside list-disc text-xs text-muted-foreground">
              {result.cautions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
