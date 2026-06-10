"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ChangePasswordInput } from "@/types/settings.types";

type SecuritySettingsCardProps = {
  isUpdating: boolean;
  onChangePassword: (input: ChangePasswordInput) => Promise<void>;
};

const initialForm: ChangePasswordInput = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export function SecuritySettingsCard({
  isUpdating,
  onChangePassword,
}: SecuritySettingsCardProps) {
  const [form, setForm] = useState<ChangePasswordInput>(initialForm);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSamePassword =
    form.currentPassword.trim().length > 0 &&
    form.password.trim().length > 0 &&
    form.currentPassword === form.password;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onChangePassword(form);

    setForm(initialForm);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-950">Security</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Change your password. For your safety, other sessions will be logged
          out after a successful update.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium text-slate-700"
          >
            Current password
          </label>

          <div className="relative mt-2">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={form.currentPassword}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  currentPassword: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              aria-label={
                showCurrentPassword
                  ? "Hide current password"
                  : "Show current password"
              }
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            New password
          </label>

          <div className="relative mt-2">
            <input
              id="password"
              type={showNewPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowNewPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              aria-label={
                showNewPassword ? "Hide new password" : "Show new password"
              }
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Must be at least 8 characters and include one uppercase letter.
          </p>
          {isSamePassword ? (
            <p className="mt-1 text-xs font-medium text-red-600">
              New password must be different from your current password.
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm new password
          </label>

          <div className="relative mt-2">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  confirmPassword: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Button type="submit" disabled={isUpdating || isSamePassword}>
            {isUpdating ? "Updating..." : "Change password"}
          </Button>
        </div>
      </form>
    </section>
  );
}
