import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "登录 · DBCNet-TCM",
  description: "DBCNet-TCM 工作站鉴权（演示）",
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
