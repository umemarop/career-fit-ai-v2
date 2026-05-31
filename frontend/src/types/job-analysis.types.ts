export type GuestJobAnalysisInput = {
  jobDescription: string;
};

export type GuestJobAnalysisResult = {
  jobTitle: string;
  companyName: string | null;
  location: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  summary: string;
  preparationTips: string[];
  warnings: string[];
};
