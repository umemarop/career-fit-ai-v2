import { api } from "@/lib/api";
import type {
  GuestJobAnalysisInput,
  GuestJobAnalysisResult,
} from "@/types/job-analysis.types";

type PublicAnalysisApiResponse = {
  status: "success";
  data: GuestJobAnalysisResult;
};

export const analyzePublicJob = async (
  input: GuestJobAnalysisInput,
): Promise<GuestJobAnalysisResult> => {
  const response = await api.post<PublicAnalysisApiResponse>(
    "/job-analysis/public",
    input,
  );

  return response.data.data;
};
