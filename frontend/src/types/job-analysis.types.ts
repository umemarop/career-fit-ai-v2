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

export type Recommendation = "APPLY" | "CONSIDER" | "NOT_RECOMMENDED";

export type JobAnalysisInput = {
  jobDescription: string;
};

export type JobAnalysisResult = {
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  risks: string[];
  resumeTips: string[];
  actionPlan: string[];
};

export type JobAnalysisDetail = {
  id: string;
  jobTitle: string;
  companyName: string | null;
  location: string | null;
  jobDescription: string;
  fitScore: number;
  recommendation: Recommendation;
  result: JobAnalysisResult;
  createdAt: string;
  updatedAt: string;
};

export type JobAnalysisListItem = {
  id: string;
  jobTitle: string;
  companyName: string | null;
  location: string | null;
  fitScore: number;
  recommendation: Recommendation;
  createdAt: string;
};

export type JobAnalysisListQuery = {
  recommendation?: Recommendation;
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: "latest" | "fitScore_desc" | "fitScore_asc";
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type JobAnalysisListResponse = {
  data: JobAnalysisListItem[];
  meta: PaginationMeta;
};
