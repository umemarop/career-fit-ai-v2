"use client";

import { useCallback, useEffect, useState } from "react";

import { adminService } from "@/services/admin.service";
import type {
  AdminRole,
  AdminStats,
  AdminUser,
  AdminUserDetail,
  AdminUsersMeta,
  AdminUsersSort,
  AdminUserStatus,
  AdminVerifiedFilter,
} from "@/types/admin.types";
import { normalizeApiError } from "@/utils/api-error";

const ADMIN_USERS_LIMIT = 10;

type AdminFilters = {
  keyword: string;
  role: "ALL" | AdminRole;
  verified: AdminVerifiedFilter;
  status: "ALL" | AdminUserStatus;
  sort: AdminUsersSort;
};

const initialFilters: AdminFilters = {
  keyword: "",
  role: "ALL",
  verified: "ALL",
  status: "ALL",
  sort: "latest",
};

export function useAdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(
    null,
  );
  const [meta, setMeta] = useState<AdminUsersMeta | null>(null);

  const [filters, setFilters] = useState<AdminFilters>(initialFilters);
  const [page, setPage] = useState(1);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const buildUsersQuery = useCallback(
    (targetPage = page) => {
      return {
        keyword: filters.keyword.trim() || undefined,
        role: filters.role === "ALL" ? undefined : filters.role,
        verified:
          filters.verified === "ALL"
            ? undefined
            : filters.verified === "VERIFIED",
        status: filters.status === "ALL" ? undefined : filters.status,
        sort: filters.sort,
        page: targetPage,
        limit: ADMIN_USERS_LIMIT,
      };
    },
    [filters, page],
  );

  const fetchStats = useCallback(async () => {
    const result = await adminService.getStats();
    setStats(result);
  }, []);

  const fetchUsers = useCallback(
    async (targetPage: number) => {
      const result = await adminService.getUsers(buildUsersQuery(targetPage));

      setUsers(result.users);
      setMeta(result.meta);

      if (result.users.length === 0) {
        setSelectedUser(null);
      }
    },
    [buildUsersQuery],
  );

  const fetchSelectedUser = useCallback(async (userId: string) => {
    const result = await adminService.getUserById(userId);
    setSelectedUser(result);
  }, []);

  useEffect(() => {
    const initializeAdminPage = async () => {
      try {
        setIsInitialLoading(true);
        setErrorMessage("");

        const usersQuery = {
          keyword: initialFilters.keyword.trim() || undefined,
          role: undefined,
          verified: undefined,
          status: undefined,
          sort: initialFilters.sort,
          page: 1,
          limit: ADMIN_USERS_LIMIT,
        };

        const [statsResult, usersResult] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(usersQuery),
        ]);

        setStats(statsResult);
        setUsers(usersResult.users);
        setMeta(usersResult.meta);

        if (usersResult.users.length === 0) {
          setSelectedUser(null);
        }
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      } finally {
        setIsInitialLoading(false);
      }
    };

    void initializeAdminPage();
  }, []);

  const refetchUsers = useCallback(
    async (targetPage: number) => {
      try {
        setIsUpdating(true);
        setErrorMessage("");

        await fetchUsers(targetPage);
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchUsers],
  );

  const selectUser = useCallback(
    async (userId: string) => {
      try {
        setIsUpdating(true);
        setErrorMessage("");

        await fetchSelectedUser(userId);
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchSelectedUser],
  );

  const updateFilters = useCallback((nextFilters: Partial<AdminFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
    }));
  }, []);

  const changePage = useCallback(
    async (nextPage: number) => {
      await refetchUsers(nextPage);
      setPage(nextPage);
    },
    [refetchUsers],
  );

  const searchUsers = useCallback(async () => {
    await refetchUsers(1);
    setPage(1);
  }, [refetchUsers]);

  const updateUserRole = useCallback(
    async (userId: string, role: AdminRole) => {
      try {
        setIsUpdating(true);
        setErrorMessage("");

        await adminService.updateUserRole(userId, { role });

        await Promise.all([
          fetchStats(),
          fetchUsers(page),
          fetchSelectedUser(userId),
        ]);
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchSelectedUser, fetchStats, fetchUsers, page],
  );

  const updateUserStatus = useCallback(
    async (userId: string, status: AdminUserStatus) => {
      try {
        setIsUpdating(true);
        setErrorMessage("");

        await adminService.updateUserStatus(userId, { status });

        await Promise.all([
          fetchStats(),
          fetchUsers(page),
          fetchSelectedUser(userId),
        ]);
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchSelectedUser, fetchStats, fetchUsers, page],
  );

  return {
    stats,
    users,
    selectedUser,
    meta,
    filters,
    page,

    isInitialLoading,
    isUpdating,
    errorMessage,

    updateFilters,
    changePage,
    searchUsers,
    selectUser,
    refetchUsers,
    updateUserRole,
    updateUserStatus,
  };
}
