export type AiUsageType = "JOB_ANALYSIS" | "RESUME_AUTOFILL";

export type AiUsageItem = {
  limit: number;
  used: number;
  remaining: number;
};

export type PublicAiUsage = AiUsageItem & {
  type: "JOB_ANALYSIS";
};

export type MyAiUsage = {
  jobAnalysis: AiUsageItem;
  resumeAutofill: AiUsageItem;
};

export type PublicAiUsageResponse = {
  status: "success";
  data: PublicAiUsage;
};

export type MyAiUsageResponse = {
  status: "success";
  data: MyAiUsage;
};
