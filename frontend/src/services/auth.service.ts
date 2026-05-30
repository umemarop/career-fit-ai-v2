import { api } from "@/lib/api";
import type {
  AuthResponse,
  LoginInput,
  MeResponse,
  MessageResponse,
  RegisterInput,
} from "@/types/auth.types";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", input);
    return response.data;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", input);
    return response.data;
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/auth/me");
    return response.data;
  },

  async logout(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>("/auth/logout");
    return response.data;
  },
};
