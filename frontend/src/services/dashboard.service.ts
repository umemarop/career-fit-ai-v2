import { api } from "@/lib/api";
import type { MessageResponse } from "@/types/settings.types";

export const dashboardService = {
  async getDashboardSummary() {
    const response = await api.get("/dashboard");

    return response.data.data;
  },

  async resendVerificationEmail() {
    const response = await api.post<MessageResponse>(
      "/auth/resend-verification",
    );

    return response.data;
  },
};
