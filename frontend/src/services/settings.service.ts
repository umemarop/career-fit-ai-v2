import { api } from "@/lib/api";
import type {
  ChangePasswordInput,
  GetMeResponse,
  GetSessionsResponse,
  MessageResponse,
} from "@/types/settings.types";

export const settingsService = {
  async getMe() {
    const response = await api.get<GetMeResponse>("/auth/me");

    return response.data.data.user;
  },

  async resendVerificationEmail() {
    const response = await api.post<MessageResponse>(
      "/auth/resend-verification",
    );

    return response.data;
  },

  async changePassword(input: ChangePasswordInput) {
    const response = await api.patch<MessageResponse>(
      "/auth/change-password",
      input,
    );

    return response.data;
  },

  async getSessions() {
    const response = await api.get<GetSessionsResponse>("/sessions");

    return response.data.data.sessions;
  },

  async revokeSession(sessionId: string) {
    await api.delete(`/sessions/${sessionId}`);
  },

  async logoutOthers() {
    const response = await api.post<MessageResponse>("/auth/logout-others");

    return response.data;
  },

  async logoutAll() {
    const response = await api.post<MessageResponse>("/auth/logout-all");

    return response.data;
  },
  async deleteAccount() {
    const response = await api.delete<MessageResponse>("/auth/me");

    return response.data;
  },
};
