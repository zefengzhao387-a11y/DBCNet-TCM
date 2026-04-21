import type { Metadata } from "next";

import { ClinicalWorkbench } from "@/components/clinical/ClinicalWorkbench";

export const metadata: Metadata = {
  title: "临床决策支持 · 岐黄智鉴",
  description: "DBCNet 临床推理录入与结果展示；对接 POST /v1/clinical/inference。",
};

export default function ClinicalPage() {
  return <ClinicalWorkbench />;
}
