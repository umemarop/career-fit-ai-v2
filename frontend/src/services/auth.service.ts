import { api } from "@/lib/api";
import type {
  LoginInput,
  LoginResponse,
  MeResponse,
  MessageResponse,
  RefreshResponse,
  RegisterInput,
  RegisterResponse,
} from "@/types/auth.types";

export const authService = {
  async login(input: LoginInput): Promise<LoginResponse["data"]> {
    const response = await api.post<LoginResponse>("/auth/login", input);
    return response.data.data;
  },

  async register(input: RegisterInput): Promise<RegisterResponse["data"]> {
    const response = await api.post<RegisterResponse>("/auth/register", input);
    return response.data.data;
  },

  async refresh(): Promise<RefreshResponse["data"]> {
    const response = await api.post<RefreshResponse>("/auth/refresh");
    return response.data.data;
  },

  async getMe(): Promise<MeResponse["data"]["user"]> {
    const response = await api.get<MeResponse>("/auth/me");
    return response.data.data.user;
  },

  async logout(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>("/auth/logout");
    return response.data;
  },
};
