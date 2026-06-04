"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { settingsService } from "@/services/settings.service";
import type {
  ChangePasswordInput,
  Session,
  SettingsUser,
} from "@/types/settings.types";
import { normalizeApiError } from "@/utils/api-error";
import { useAuth } from "@/features/auth/useAuth";

type SettingsStatus = {
  type: "success" | "error";
  message: string;
} | null;

export function useSettingsPage() {
  const router = useRouter();
  const { clearAuthState } = useAuth();

  const [user, setUser] = useState<SettingsUser | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<SettingsStatus>(null);

  const fetchSettingsData = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      setStatusMessage(null);

      const [currentUser, userSessions] = await Promise.all([
        settingsService.getMe(),
        settingsService.getSessions(),
      ]);

      setUser(currentUser);
      setSessions(userSessions);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  const refreshSessions = useCallback(async () => {
    const userSessions = await settingsService.getSessions();
    setSessions(userSessions);
  }, []);

  const handleResendVerification = async () => {
    try {
      setIsUpdating(true);
      setStatusMessage(null);

      const response = await settingsService.resendVerificationEmail();

      setStatusMessage({
        type: "success",
        message: response.message,
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (input: ChangePasswordInput) => {
    try {
      setIsUpdating(true);
      setStatusMessage(null);

      const response = await settingsService.changePassword(input);

      await refreshSessions();

      setStatusMessage({
        type: "success",
        message:
          response.message ||
          "Password changed successfully. Other sessions have been logged out.",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setIsUpdating(true);
      setStatusMessage(null);

      await settingsService.revokeSession(sessionId);
      await refreshSessions();

      setStatusMessage({
        type: "success",
        message: "Session revoked successfully.",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoutOthers = async () => {
    try {
      setIsUpdating(true);
      setStatusMessage(null);

      const response = await settingsService.logoutOthers();
      await refreshSessions();

      setStatusMessage({
        type: "success",
        message: response.message,
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsUpdating(true);
      setStatusMessage(null);

      await settingsService.logoutAll();

      clearAuthState();
      router.replace("/login");
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      setIsUpdating(true);
      setStatusMessage(null);

      await settingsService.deleteAccount();

      clearAuthState();
      router.replace("/login?accountDeleted=1");
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    user,
    sessions,
    isInitialLoading,
    isUpdating,
    statusMessage,

    fetchSettingsData,
    handleResendVerification,
    handleChangePassword,
    handleRevokeSession,
    handleLogoutOthers,
    handleLogoutAll,
    handleDeleteAccount,
  };
}
