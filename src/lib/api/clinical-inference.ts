import { getPublicApiOrigin, hasPublicApiOrigin } from "@/lib/api/public-origin";
import type {
  ClinicalInferenceRequest,
  ClinicalInferenceResponse,
} from "@/types/clinical-inference";

const PATH = "/v1/clinical/inference";

export async function requestClinicalInference(
  body: ClinicalInferenceRequest,
  init?: RequestInit,
): Promise<ClinicalInferenceResponse> {
  if (!hasPublicApiOrigin()) {
    return {
      narrative:
        "未配置 NEXT_PUBLIC_API_BASE。接入后端后，将在此展示模型融合输出的辨证叙事；右侧「逻辑链」可绑定 evidenceGraph。",
      syndromeLabels: ["演示", "待接入"],
      evidenceGraph: {
        nodes: [
          { id: "n1", label: "主诉", role: "symptom" },
          { id: "n2", label: "证候（占位）", role: "syndrome" },
        ],
        edges: [{ source: "n1", target: "n2", relation: "supports" }],
      },
    };
  }

  const res = await fetch(`${getPublicApiOrigin()}${PATH}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Inference failed (${res.status})`);
  }

  return (await res.json()) as ClinicalInferenceResponse;
}
