"use client";

import { EmailVerificationBanner } from "./components/EmailVerificationBanner";
import { DashboardQuickActions } from "@/features/dashboard/components/DashboardQuickActions";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { DashboardWelcome } from "@/features/dashboard/components/DashboardWelcome";
import { RecentAnalyses } from "@/features/dashboard/components/RecentAnalyses";
import { RecentApplications } from "@/features/dashboard/components/RecentApplications";
import { useDashboardPage } from "@/features/dashboard/hooks/useDashboardPage";

export function DashboardPageClient() {
  const {
    user,
    stats,
    quickActions,
    verificationMessage,
    isResendingVerification,
    handleResendVerification,
    recentAnalyses,
    recentApplications,
    isLoading,
    errorMessage,
  } = useDashboardPage();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardWelcome user={user} />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {user && !user.isEmailVerified ? (
        <EmailVerificationBanner
          email={user.email}
          isSending={isResendingVerification}
          message={verificationMessage}
          onResend={handleResendVerification}
        />
      ) : null}

      <DashboardStats stats={stats} />

      <DashboardQuickActions actions={quickActions} />

      <section className="grid gap-4 lg:grid-cols-2">
        <RecentAnalyses analyses={recentAnalyses} />
        <RecentApplications applications={recentApplications} />
      </section>
    </div>
  );
}
