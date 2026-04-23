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
        { code: "pinghe", label: "平和质", score: 0.38 },
        { code: "qixu", label: "气虚质", score: 0.26 },
        { code: "yangxu", label: "阳虚质", score: 0.12 },
        { code: "yinxu", label: "阴虚质", score: 0.08 },
        { code: "tanshi", label: "痰湿质", score: 0.1 },
        { code: "shire", label: "湿热质", score: 0.06 },
      ],
      narrative:
        "综合舌象与量表，气虚与痰湿倾向相对突出，平和质仍占一定比例；宜规律作息、适度运动，饮食清淡少甜腻。",
      cautions: ["演示数据不构成医疗建议；不适请就医。"],
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
