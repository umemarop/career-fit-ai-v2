"use client";

import { AccountSettingsCard } from "./components/AccountSettingsCard";
import { DangerZoneCard } from "./components/DangerZoneCard";
import { SecuritySettingsCard } from "./components/SecuritySettingsCard";
import { SessionSettingsCard } from "./components/SessionSettingsCard";
import { useSettingsPage } from "./hooks/useSettingsPage";

export function SettingsPageClient() {
  const {
    user,
    sessions,
    isInitialLoading,
    isUpdating,
    statusMessage,
    handleResendVerification,
    handleChangePassword,
    handleRevokeSession,
    handleLogoutOthers,
    handleLogoutAll,
    handleDeleteAccount,
  } = useSettingsPage();

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account, security, and active sessions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account, security, and active sessions.
        </p>
      </div>

      {statusMessage ? (
        <div
          className={`rounded-xl border p-4 text-sm ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMessage.message}
        </div>
      ) : null}

      <AccountSettingsCard
        user={user}
        isUpdating={isUpdating}
        onResendVerification={handleResendVerification}
      />

      <SecuritySettingsCard
        isUpdating={isUpdating}
        onChangePassword={handleChangePassword}
      />

      <SessionSettingsCard
        sessions={sessions}
        isUpdating={isUpdating}
        onRevokeSession={handleRevokeSession}
        onLogoutOthers={handleLogoutOthers}
        onLogoutAll={handleLogoutAll}
      />

      <DangerZoneCard
        isUpdating={isUpdating}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
