"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { normalizeApiError } from "@/utils/api-error";

export function ResetPasswordPageClient() {
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Password reset link is invalid or expired.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("New password is required.");
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage("Confirm password is required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await authService.resetPassword({
        token,
        password,
        confirmPassword,
      });

      setSuccessMessage(
        "Password reset successfully. You can now log in with your new password.",
      );
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <KeyRound className="h-6 w-6 text-slate-700" />
      </div>

      <h1 className="text-2xl font-bold text-slate-950">Reset your password</h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Choose a new password for your account. Use at least 8 characters and
        one uppercase letter.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            New password
          </label>

          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={isSubmitting}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              className="pr-10"
            />

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>

          <div className="relative mt-2">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              disabled={isSubmitting}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="pr-10"
            />

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
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

        {successMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {!successMessage && (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        )}
      </form>

      <div className="mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
