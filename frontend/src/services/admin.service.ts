import { api } from "@/lib/api";
import type {
  AdminStats,
  AdminUserDetailResponse,
  AdminUserResponse,
  AdminUsersQuery,
  AdminUsersResponse,
  UpdateAdminUserRoleInput,
  UpdateAdminUserStatusInput,
} from "@/types/admin.types";

type ApiResponse<T> = {
  status: "success";
  data: T;
};

export const adminService = {
  async getStats() {
    const response = await api.get<ApiResponse<AdminStats>>("/admin/stats");

    return response.data.data;
  },

  async getUsers(query: AdminUsersQuery) {
    const response = await api.get<ApiResponse<AdminUsersResponse>>(
      "/admin/users",
      {
        params: query,
      },
    );

    return response.data.data;
  },

  async getUserById(userId: string) {
    const response = await api.get<ApiResponse<AdminUserDetailResponse>>(
      `/admin/users/${userId}`,
    );

    return response.data.data.user;
  },

  async updateUserRole(userId: string, input: UpdateAdminUserRoleInput) {
    const response = await api.patch<ApiResponse<AdminUserResponse>>(
      `/admin/users/${userId}/role`,
      input,
    );

    return response.data.data.user;
  },

  async updateUserStatus(userId: string, input: UpdateAdminUserStatusInput) {
    const response = await api.patch<ApiResponse<AdminUserResponse>>(
      `/admin/users/${userId}/status`,
      input,
    );

    return response.data.data.user;
  },
};
