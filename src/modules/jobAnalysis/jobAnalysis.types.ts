import { Recommendation } from "../../generated/prisma/enums.js";
import type { JobAnalysisResultResponse } from "./jobAnalysis.validation.js";

export interface JobAnalysisListItemResponse {
  id: string;
  jobTitle: string;
  companyName: string | null;
  location: string | null;
  fitScore: number;
  recommendation: Recommendation;
  createdAt: Date;
}

export interface JobAnalysisDetailResponse {
  id: string;
  jobTitle: string;
  companyName: string | null;
  location: string | null;
  jobDescription: string;
  fitScore: number;
  recommendation: Recommendation;
  result: JobAnalysisResultResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildGuestAnalysisPromptInput {
  jobDescription: string;
}

export interface BuildUserAnalysisPromptInput {
  jobDescription: string;
  profile: {
    skills: string[];
    experienceLevel: string;
    workEligibility: string | null;
    location: string | null;
    targetRole: string | null;
  };
}
