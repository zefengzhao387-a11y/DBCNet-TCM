"use client";
import { useMemo } from "react";

import {
  getEdgeEndpoints,
  layoutLogicGraph,
} from "@/lib/logic-graph-layout";
import { cn } from "@/lib/utils";
import { useLogicGraphStore } from "@/stores/logic-graph-store";

function nodeColor(role: string | undefined): string {
  switch (role) {
    case "symptom":
      return "color-mix(in srgb, var(--season-accent) 75%, #647066)";
    case "syndrome":
      return "color-mix(in srgb, var(--primary) 80%, #334)";
    case "formula":
      return "color-mix(in srgb, #b42318 55%, var(--season-accent))";
    case "herb":
      return "color-mix(in srgb, var(--season-accent) 60%, #5a6)";
    default:
      return "color-mix(in srgb, var(--muted-foreground) 90%, transparent)";
  }
}

export function LogicGraphCanvas({ className }: { className?: string }) {
  const phase = useLogicGraphStore((s) => s.phase);
  const nodes = useLogicGraphStore((s) => s.nodes);
  const edges = useLogicGraphStore((s) => s.edges);
  const activeEdgeCount = useLogicGraphStore((s) => s.activeEdgeCount);

  const { positioned, viewBox, edgePaths } = useMemo(() => {
    const { positioned: p, viewBox: vb } = layoutLogicGraph(nodes);
    const ep = getEdgeEndpoints(edges, p);
    return { positioned: p, viewBox: vb, edgePaths: ep };
  }, [nodes, edges]);

  const visibleEdges = edgePaths.slice(0, activeEdgeCount);

  if (phase === "idle" && nodes.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-2 px-3 py-6 text-center text-xs text-muted-foreground",
          className,
        )}
      >
        <p className="leading-relaxed">
          在智诊页生成辨证时，此处将同步展示
          <span className="text-foreground/80">症状 → 证候 → 方药</span>
          的推理连线。
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative flex min-h-[12rem] flex-1 flex-col", className)}>
      <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {phase === "streaming" ? "推理进行中" : "逻辑链 · 证据图谱"}
      </p>
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border/50 bg-background/70 backdrop-blur-md">
        <svg
          className="h-full min-h-[220px] w-full"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {visibleEdges.map(({ edge, path }, i) => (
            <path
              key={`${edge.source}-${edge.target}-${i}`}
              d={path}
              fill="none"
              stroke="color-mix(in srgb, var(--border) 92%, transparent)"
              strokeWidth={1}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}

          {positioned.map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={10}
                fill={nodeColor(n.role)}
                opacity={0.92}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={13}
                fill="none"
                stroke="color-mix(in srgb, white 35%, transparent)"
                strokeWidth={0.6}
                opacity={0.5}
              />
              <text
                x={n.x}
                y={(n.y ?? 0) + 28}
                textAnchor="middle"
                fill="color-mix(in srgb, var(--foreground) 92%, transparent)"
                style={{
                  fontSize: "8px",
                  fontFamily: "var(--font-noto-serif), var(--font-serif-stack)",
                }}
              >
                {n.label.length > 5 ? `${n.label.slice(0, 5)}…` : n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
