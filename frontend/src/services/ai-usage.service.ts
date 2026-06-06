import { api } from "@/lib/api";
import type {
  MyAiUsageResponse,
  PublicAiUsageResponse,
} from "@/types/ai-usage.types";

export const aiUsageService = {
  async getPublicAiUsage() {
    const response = await api.get<PublicAiUsageResponse>("/ai-usage/public");

    return response.data.data;
  },

  async getMyAiUsage() {
    const response = await api.get<MyAiUsageResponse>("/ai-usage/me");

    return response.data.data;
  },
};
