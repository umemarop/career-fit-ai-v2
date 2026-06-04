import { Mail, ShieldCheck, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SettingsUser } from "@/types/settings.types";
import { formatDate } from "@/utils/format";

type AccountSettingsCardProps = {
  user: SettingsUser | null;
  isUpdating: boolean;
  onResendVerification: () => Promise<void>;
};

export function AccountSettingsCard({
  user,
  isUpdating,
  onResendVerification,
}: AccountSettingsCardProps) {
  const isVerified = Boolean(user?.isEmailVerified);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Account</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review your account identity and email verification status.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isVerified
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isVerified ? (
            <ShieldCheck className="h-3.5 w-3.5" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5" />
          )}
          {isVerified ? "Verified" : "Unverified"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail className="h-4 w-4 text-slate-400" />
            Email
          </div>
          <p className="break-all text-sm font-semibold text-slate-950">
            {user?.email ?? "Not available"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Role</p>
          <p className="text-sm font-semibold text-slate-950">
            {user?.role ?? "USER"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Verification date
          </p>
          <p className="text-sm font-semibold text-slate-950">
            {user?.emailVerifiedAt
              ? formatDate(user.emailVerifiedAt)
              : "Not verified yet"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Member since
          </p>
          <p className="text-sm font-semibold text-slate-950">
            {user?.createdAt ? formatDate(user.createdAt) : "Not available"}
          </p>
        </div>
      </div>

      {!isVerified ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-amber-900">
                Email verification required
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Verify your email to unlock all protected CareerFit AI features.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResendVerification}
              disabled={isUpdating}
              className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
            >
              {isUpdating ? "Sending..." : "Resend verification"}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
