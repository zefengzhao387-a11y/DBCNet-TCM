"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo } from "react";

import type { Season } from "@/types/season";

/** 气韵层：多团、略高不透明度与位移幅度，仍保持长周期舒缓 */

type InkBlob = {
  id: string;
  d: string;
  widthVw: number;
  left: string;
  top: string;
  originX: string;
  originY: string;
  driftX: [number, number, number, number, number];
  driftY: [number, number, number, number, number];
  rotate: [number, number, number, number];
  scale: [number, number, number, number];
  duration: number;
  delay: number;
  opacity: number;
};

const INK_BLOBS: InkBlob[] = [
  {
    id: "a",
    d: "M120,700 C60,480 200,200 460,220 C640,235 880,180 960,380 C1020,520 860,720 560,780 C300,830 100,760 120,700 Z",
    widthVw: 56,
    left: "-8%",
    top: "4%",
    originX: "46%",
    originY: "50%",
    driftX: [-34, 40, -22, 26, -34],
    driftY: [22, -30, 20, -15, 22],
    rotate: [-2.8, 1.7, -1.1, -2.8],
    scale: [1, 1.08, 0.95, 1],
    duration: 62,
    delay: 0,
    opacity: 0.9,
  },
  {
    id: "b",
    d: "M880,160 C1000,100 1080,280 1020,440 C960,600 760,640 560,560 C380,490 320,320 400,200 C480,90 720,100 880,160 Z",
    widthVw: 52,
    left: "44%",
    top: "-12%",
    originX: "54%",
    originY: "36%",
    driftX: [36, -28, 32, -22, 36],
    driftY: [-24, 28, -18, 22, -24],
    rotate: [2.1, -1.9, 1.3, 2.1],
    scale: [1, 0.94, 1.07, 1],
    duration: 58,
    delay: 8,
    opacity: 0.86,
  },
  {
    id: "c",
    d: "M40,400 C180,260 420,300 620,220 C860,120 1040,280 1000,480 C960,660 720,720 460,760 C200,800 20,620 40,400 Z",
    widthVw: 60,
    left: "2%",
    top: "36%",
    originX: "48%",
    originY: "56%",
    driftX: [-22, -42, 25, 17, -22],
    driftY: [26, 12, -33, 19, 26],
    rotate: [1.2, -2.4, 0.95, 1.2],
    scale: [1, 1.06, 0.96, 1],
    duration: 66,
    delay: 16,
    opacity: 0.88,
  },
  {
    id: "d",
    d: "M520,880 C300,840 160,640 240,480 C300,340 480,260 700,300 C920,340 1080,500 1020,680 C960,820 720,880 520,880 Z",
    widthVw: 54,
    left: "22%",
    top: "48%",
    originX: "56%",
    originY: "74%",
    driftX: [27, -20, -36, 29, 27],
    driftY: [-22, 30, -15, 24, -22],
    rotate: [-1.9, 2.5, -1.2, -1.9],
    scale: [1, 0.96, 1.08, 1],
    duration: 70,
    delay: 4,
    opacity: 0.82,
  },
];

function seasonInkFills(season: Season): string[] {
  switch (season) {
    case "summer":
      return [
        "color-mix(in srgb, #c07060 44%, transparent)",
        "color-mix(in srgb, #d8a898 36%, transparent)",
        "color-mix(in srgb, #e8c8b8 32%, transparent)",
        "color-mix(in srgb, #b86858 36%, transparent)",
      ];
    case "autumn":
      return [
        "color-mix(in srgb, #b89868 42%, transparent)",
        "color-mix(in srgb, #d4c090 34%, transparent)",
        "color-mix(in srgb, #c8b078 32%, transparent)",
        "color-mix(in srgb, #a88858 36%, transparent)",
      ];
    case "winter":
      return [
        "color-mix(in srgb, #98b0d8 40%, transparent)",
        "color-mix(in srgb, #b8c8e8 32%, transparent)",
        "color-mix(in srgb, #8898c0 36%, transparent)",
        "color-mix(in srgb, #a8b8d8 30%, transparent)",
      ];
    case "spring":
    default:
      return [
        "color-mix(in srgb, #78b078 42%, transparent)",
        "color-mix(in srgb, #a0d0a8 34%, transparent)",
        "color-mix(in srgb, #b8e0c0 30%, transparent)",
        "color-mix(in srgb, #88c098 36%, transparent)",
      ];
  }
}

type QiFlowProps = {
  season: Season;
};

export function QiFlow({ season }: QiFlowProps) {
  const { scrollY } = useScroll();
  const mistParallax = useTransform(scrollY, (v) => v * 0.52);
  const mistY = useSpring(mistParallax, {
    stiffness: 36,
    damping: 34,
    mass: 0.9,
  });

  const fills = useMemo(() => seasonInkFills(season), [season]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      style={{ y: mistY }}
      aria-hidden
    >
      {INK_BLOBS.map((blob, i) => (
        <motion.div
          key={`${season}-${blob.id}`}
          className="absolute blur-[56px] sm:blur-[72px]"
          style={{
            width: `${blob.widthVw}vw`,
            maxWidth: "min(78vw, 1000px)",
            left: blob.left,
            top: blob.top,
            transformOrigin: `${blob.originX} ${blob.originY}`,
            opacity: blob.opacity,
          }}
          animate={{
            x: blob.driftX,
            y: blob.driftY,
            rotate: blob.rotate,
            scale: blob.scale,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1] as const,
            delay: blob.delay,
          }}
        >
          <svg
            className="h-auto w-full"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={blob.d} fill={fills[i % fills.length]} />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}
