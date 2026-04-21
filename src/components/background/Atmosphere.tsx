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
  /** 首页长卷用 extended；工作台等固定视口用 viewport */
  layout?: "extended" | "viewport";
};

/** 竖向只做极弱明度起伏，四时与「竹青 / 朱荷 / 银杏金 / 墨色」氛围一致 */
function skyBackground(season: Season): string {
  switch (season) {
    case "spring":
      return "linear-gradient(180deg, #f4faf7 0%, #eef6f2 32%, #e8f2ec 68%, #e2ede6 100%)";
    case "summer":
      return "linear-gradient(180deg, #fcf9f6 0%, #f8f2ec 38%, #f3ebe4 72%, #efe6dc 100%)";
    case "autumn":
      return "linear-gradient(180deg, #fcf9f2 0%, #f8f2e6 38%, #f2e9d8 72%, #ebe0cc 100%)";
    case "winter":
      return "linear-gradient(180deg, #121418 0%, #0e1014 38%, #0a0c10 72%, #060708 100%)";
    default:
      return "linear-gradient(180deg, #f4faf7 0%, #eef6f2 32%, #e8f2ec 68%, #e2ede6 100%)";
  }
}

function stardustFill(season: Season): string {
  switch (season) {
    case "spring":
      return "rgba(62, 108, 92, 0.42)";
    case "summer":
      return "rgba(150, 72, 68, 0.4)";
    case "autumn":
      return "rgba(140, 112, 68, 0.44)";
    case "winter":
      return "rgba(180, 188, 210, 0.22)";
    default:
      return "rgba(62, 108, 92, 0.42)";
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

export function Atmosphere({
  season,
  layout = "extended",
}: AtmosphereProps) {
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
  const dustFill = useMemo(() => stardustFill(season), [season]);

  const canvasMin =
    layout === "viewport"
      ? "100dvh"
      : `calc(100dvh + ${CANVAS_EXTRA_VH * 2}vh)`;
  const canvasTop = layout === "viewport" ? "0" : `-${CANVAS_EXTRA_VH}vh`;

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
                fill={dustFill}
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
            season === "winter"
              ? "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 45%, rgba(255,255,255,0.02) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.05) 100%)",
        }}
        animate={{ opacity: [0.72, 0.88, 0.68, 0.84, 0.72] }}
        transition={{
          duration: 36,
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
          duration: 72,
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
          duration: 78,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
}
