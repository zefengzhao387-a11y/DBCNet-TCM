/** POST /v1/clinical/inference */
export type ClinicalInferenceRequest = {
  chiefComplaint: string;
  fourExaminationsNotes?: string;
  /** BCP-47; default zh-CN on server if omitted */
  locale?: "zh-CN";
};

export type EvidenceGraphHint = {
  id: string;
  label: string;
  role?: "symptom" | "syndrome" | "formula" | "herb" | "other";
};

export type PrescriptionLine = {
  herb: string;
  /** 如「9g」「先煎」 */
  dosage?: string;
};

export type ClinicalInferenceResponse = {
  narrative: string;
  syndromeLabels?: string[];
  evidenceGraph?: {
    nodes: EvidenceGraphHint[];
    edges: { source: string; target: string; relation?: string }[];
  };
  /** 方剂示意（可解释 UI 用手写笺呈现） */
  prescription?: {
    title?: string;
    lines: PrescriptionLine[];
    /** 红色数字印，如 叁、柒 */
    sealNumber?: string;
  };
};
