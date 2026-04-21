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
        "未配置 NEXT_PUBLIC_API_BASE。以下为本地演示：据主诉合参，气机郁滞兼脾失健运之象偏显；治以疏肝健脾、和中调气为法。接入后端后，叙事与 evidenceGraph 将来自真实模型输出。",
      syndromeLabels: ["肝郁脾虚（演示）", "气滞湿阻（演示）"],
      evidenceGraph: {
        nodes: [
          { id: "sx1", label: "脘腹胀满", role: "symptom" },
          { id: "sx2", label: "情志不畅", role: "symptom" },
          { id: "sx3", label: "纳差", role: "symptom" },
          { id: "syn1", label: "肝郁脾虚", role: "syndrome" },
          { id: "fo1", label: "逍遥散化裁", role: "formula" },
          { id: "hb1", label: "柴胡", role: "herb" },
          { id: "hb2", label: "白术", role: "herb" },
          { id: "hb3", label: "茯苓", role: "herb" },
        ],
        edges: [
          { source: "sx1", target: "syn1", relation: "合参" },
          { source: "sx2", target: "syn1", relation: "合参" },
          { source: "sx3", target: "syn1", relation: "合参" },
          { source: "syn1", target: "fo1", relation: "立法" },
          { source: "fo1", target: "hb1", relation: "臣" },
          { source: "fo1", target: "hb2", relation: "佐" },
          { source: "fo1", target: "hb3", relation: "佐" },
        ],
      },
      prescription: {
        title: "方意笺",
        sealNumber: "柒",
        lines: [
          { herb: "柴胡", dosage: "9g" },
          { herb: "白术", dosage: "12g" },
          { herb: "茯苓", dosage: "15g" },
          { herb: "炙甘草", dosage: "6g" },
          { herb: "生姜", dosage: "3片" },
        ],
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
