"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo } from "react";

import type { Season } from "@/types/season";

import { QiFlow } from "./QiFlow";

const STARDUST_COUNT = 72;

type AtmosphereProps = {
  season: Season;
};

/** 竖向只做极弱明度起伏，避免与罩层叠出「一道杠」色差 */
function skyBackground(season: Season): string {
  switch (season) {
    case "spring":
      return "linear-gradient(180deg, #f9fcf9 0%, #f6faf6 35%, #f3f7f3 70%, #f0f5f0 100%)";
    case "summer":
      return "linear-gradient(180deg, #fcfaf8 0%, #f9f5f0 38%, #f6f0e8 72%, #f3ebe4 100%)";
    case "autumn":
      return "linear-gradient(180deg, #fcfaf6 0%, #f8f4ec 38%, #f4efe4 72%, #f1ebe0 100%)";
    case "winter":
      return "linear-gradient(180deg, #f9fafc 0%, #f4f6fa 38%, #eef2f8 72%, #eaeff6 100%)";
    default:
      return "linear-gradient(180deg, #f9fcf9 0%, #f6faf6 35%, #f3f7f3 70%, #f0f5f0 100%)";
  }
}

type DustSpec = {
  cx: number;
  cy: number;
  r: number;
  base: number;
  dur: number;
  delay: number;
  dx: number;
  dy: number;
};

/**
 * 画布高于视口并向上、下各伸出一段，配合 scroll translateY 仍满屏不露边。
 * 高度用 min-h 保证长页滚动时视口内始终有足量像素。
 */
const CANVAS_EXTRA_VH = 85;

export function Atmosphere({ season }: AtmosphereProps) {
  const { scrollY } = useScroll();
  const particleScroll = useTransform(scrollY, (v) => v * 0.3);
  const particleLayerY = useSpring(particleScroll, {
    stiffness: 44,
    damping: 34,
    mass: 0.85,
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mouseX = useSpring(mx, { stiffness: 32, damping: 24 });
  const mouseY = useSpring(my, { stiffness: 32, damping: 24 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 30);
      my.set((e.clientY / window.innerHeight - 0.5) * 24);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const stardust = useMemo(() => {
    return Array.from({ length: STARDUST_COUNT }, (_, i) => {
      const seed = ((i * 7919) % 1000) / 1000;
      return {
        cx: (Math.sin(i * 2.11) * 0.5 + 0.5) * 1200,
        cy: (Math.cos(i * 1.87) * 0.5 + 0.5) * 900,
        r: 0.26 + seed * 0.42,
        base: 0.14 + (i % 7) * 0.03,
        dur: 11 + (i % 9) * 1.6,
        delay: (i % 18) * 0.32,
        dx: (Math.sin(i * 0.73) * 10 + (i % 4)) * 0.55,
        dy: (Math.cos(i * 0.91) * 8 + (i % 3)) * 0.55,
      } satisfies DustSpec;
    });
  }, []);

  const sky = useMemo(() => skyBackground(season), [season]);

  const canvasMin = `calc(100dvh + ${CANVAS_EXTRA_VH * 2}vh)`;
  const canvasTop = `-${CANVAS_EXTRA_VH}vh`;

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 w-full overflow-hidden"
      style={{ top: canvasTop, minHeight: canvasMin }}
      aria-hidden
      data-season={season}
    >
      <div className="absolute inset-0" style={{ background: sky }} />

      <QiFlow season={season} />

      <motion.div className="absolute inset-0" style={{ y: particleLayerY }}>
        <motion.svg
          className="h-full w-full"
          viewBox="0 0 1200 900"
          preserveAspectRatio="none"
          style={{ x: mouseX, y: mouseY }}
        >
          <g>
            {stardust.map((p, i) => (
              <motion.circle
                key={`d-${i}`}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="rgba(56, 96, 72, 0.62)"
                animate={{
                  opacity: [p.base * 0.65, p.base * 2.75, p.base * 0.7],
                  cx: [p.cx, p.cx + p.dx, p.cx - p.dx * 0.35, p.cx],
                  cy: [p.cy, p.cy + p.dy, p.cy - p.dy * 0.4, p.cy],
                }}
                transition={{
                  duration: p.dur,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay,
                }}
              />
            ))}
          </g>
        </motion.svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 42%, rgba(255,255,255,0.04) 100%)",
        }}
        animate={{ opacity: [0.78, 0.9, 0.74, 0.86, 0.78] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-[18%] opacity-[0.16] blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 35% 45%, color-mix(in srgb, var(--season-accent) 48%, transparent), transparent 72%)",
        }}
        animate={{
          x: ["-2%", "3%", "-1%", "-2%"],
          y: ["0%", "-2%", "1%", "0%"],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 52,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-[18%] opacity-[0.14] blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 70% 55%, color-mix(in srgb, var(--primary) 44%, transparent), transparent 75%)",
        }}
        animate={{
          x: ["2%", "-3%", "1%", "2%"],
          y: ["1%", "2%", "-1%", "1%"],
          scale: [1, 0.97, 1.04, 1],
        }}
        transition={{
          duration: 58,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
}
