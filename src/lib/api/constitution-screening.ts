import { getPublicApiOrigin, hasPublicApiOrigin } from "@/lib/api/public-origin";
import type {
  ConstitutionQuestionnaire,
  ConstitutionScreeningResponse,
} from "@/types/constitution-screening";

const PATH = "/v1/constitution/screening";

export async function requestConstitutionScreening(
  image: File | null,
  questionnaire: ConstitutionQuestionnaire,
  init?: RequestInit,
): Promise<ConstitutionScreeningResponse> {
  if (!hasPublicApiOrigin()) {
    return {
      constitutionTypes: [
        { code: "demo", label: "平和质（演示）", score: 0.42 },
        { code: "demo2", label: "气虚质（演示）", score: 0.31 },
      ],
      narrative:
        "未配置 NEXT_PUBLIC_API_BASE。接入后由舌象与问卷融合模型返回体质分布与宣教文案。",
      cautions: ["演示数据不构成医疗建议。"],
    };
  }

  const fd = new FormData();
  if (image) fd.set("tongue_image", image, image.name);
  fd.set("questionnaire", JSON.stringify(questionnaire));

  const res = await fetch(`${getPublicApiOrigin()}${PATH}`, {
    method: "POST",
    body: fd,
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Screening failed (${res.status})`);
  }

  return (await res.json()) as ConstitutionScreeningResponse;
}
