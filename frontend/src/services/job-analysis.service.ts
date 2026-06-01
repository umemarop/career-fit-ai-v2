import { api } from "@/lib/api";
import type {
  JobAnalysisDetail,
  JobAnalysisInput,
  JobAnalysisListQuery,
  JobAnalysisListResponse,
} from "@/types/job-analysis.types";

type ApiResponse<T> = {
  status: "success";
  data: T;
};

type ApiListResponse<T> = {
  status: "success";
  data: T;
  meta: JobAnalysisListResponse["meta"];
};

export const jobAnalysisService = {
  async create(input: JobAnalysisInput): Promise<JobAnalysisDetail> {
    const response = await api.post<ApiResponse<JobAnalysisDetail>>(
      "/job-analysis",
      input,
    );

    return response.data.data;
  },

  async getMyAnalyses(
    query?: JobAnalysisListQuery,
  ): Promise<JobAnalysisListResponse> {
    const response = await api.get<
      ApiListResponse<JobAnalysisListResponse["data"]>
    >("/job-analysis", {
      params: query,
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: string): Promise<JobAnalysisDetail> {
    const response = await api.get<ApiResponse<JobAnalysisDetail>>(
      `/job-analysis/${id}`,
    );

    return response.data.data;
  },
};
