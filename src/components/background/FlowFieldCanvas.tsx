"use client";

import { useLayoutEffect, useRef } from "react";

import type { Season } from "@/types/season";

type FlowFieldCanvasProps = {
  season: Season;
};

/** 浅色雾粒：四季略偏色，整体高明度 */
type Mist = { r: number; g: number; b: number };

function seasonMist(season: Season): Mist {
  switch (season) {
    case "summer":
      return { r: 255, g: 236, b: 228 };
    case "autumn":
      return { r: 250, g: 238, b: 222 };
    case "winter":
      return { r: 228, g: 234, b: 244 };
    case "spring":
    default:
      return { r: 232, g: 244, b: 236 };
  }
}

function flowVelocity(
  x: number,
  y: number,
  tMs: number,
): { vx: number; vy: number } {
  const k = 0.00265;
  const wt = tMs * 0.00038;
  const vx =
    Math.sin(y * k + wt) * 1.4 +
    Math.cos((x * 0.71 + y * 0.53) * k * 1.15 + wt * 1.05) * 0.62;
  const vy =
    Math.cos(x * k - wt * 0.92) * 1.4 +
    Math.sin((x * 0.61 - y * 0.74) * k * 1.12 - wt * 0.88) * 0.58;
  const len = Math.hypot(vx, vy) + 1e-6;
  return { vx: vx / len, vy: vy / len };
}

type MistParticle = {
  x: number;
  y: number;
  rHalo: number;
  rCore: number;
  phase: number;
};

function particleCount(w: number, h: number): number {
  const area = Math.max(1, w * h);
  const n = Math.floor(area / 13_500);
  return Math.max(88, Math.min(168, n));
}

function initParticles(w: number, h: number): MistParticle[] {
  const n = particleCount(w, h);
  const out: MistParticle[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: Math.random() * w,
      y: Math.random() * h,
      rHalo: 5 + Math.random() * 6,
      rCore: 1.0 + Math.random() * 1.35,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return out;
}

export function FlowFieldCanvas({ season }: FlowFieldCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mistRef = useRef(seasonMist(season));
  mistRef.current = seasonMist(season);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: MistParticle[] = [];
    let widthCss = 0;
    let heightCss = 0;
    let dpr = 1;
    let raf = 0;
    const t0 = performance.now();
    let last = t0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      let w = wrap.clientWidth;
      let h = wrap.clientHeight;
      const parent = wrap.parentElement;
      if (h < 8 && parent) {
        w = Math.max(w, parent.clientWidth);
        h = Math.max(h, parent.clientHeight);
      }
      widthCss = Math.max(1, w);
      heightCss = Math.max(1, h);
      canvas.width = Math.floor(widthCss * dpr);
      canvas.height = Math.floor(heightCss * dpr);
      canvas.style.width = `${widthCss}px`;
      canvas.style.height = `${heightCss}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = initParticles(widthCss, heightCss);
    };

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(wrap);
    resize();
    requestAnimationFrame(() => {
      resize();
    });

    const step = (now: number) => {
      if (document.visibilityState === "hidden") {
        raf = requestAnimationFrame(step);
        return;
      }

      const mist = mistRef.current;
      const t = now - t0;
      const dt = Math.min(40, now - last) / 16.67;
      last = now;

      const w = widthCss;
      const h = heightCss;
      if (w < 4 || h < 4 || particles.length === 0) {
        raf = requestAnimationFrame(step);
        return;
      }

      const speed = season === "winter" ? 2.35 : 2.65;
      const breathe = (p: MistParticle) =>
        0.88 + 0.12 * Math.sin(t * 0.00055 + p.phase);

      ctx.clearRect(0, 0, w, h);

      const { r, g, b } = mist;
      const haloA = season === "winter" ? 0.12 : 0.11;
      const coreA = season === "winter" ? 0.22 : 0.19;

      for (const p of particles) {
        const { vx, vy } = flowVelocity(p.x, p.y, t);
        p.x += vx * speed * dt;
        p.y += vy * speed * dt;
        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;

        const br = breathe(p);
        const rh = p.rHalo * br;
        const rc = p.rCore * (0.92 + 0.08 * Math.sin(t * 0.0009 + p.phase * 1.3));

        ctx.fillStyle = `rgba(${r},${g},${b},${haloA})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rh, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r},${g},${b},${coreA})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rc, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [season]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[5] min-h-full w-full overflow-hidden"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full min-h-full w-full min-w-full" />
    </div>
  );
}
