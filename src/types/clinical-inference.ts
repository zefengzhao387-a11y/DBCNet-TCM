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

export type ClinicalInferenceResponse = {
  narrative: string;
  syndromeLabels?: string[];
  evidenceGraph?: {
    nodes: EvidenceGraphHint[];
    edges: { source: string; target: string; relation?: string }[];
  };
};
