import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "入室 · 岐黄智鉴",
  description: "演示鉴权入口；背景随四时气韵流动。",
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
