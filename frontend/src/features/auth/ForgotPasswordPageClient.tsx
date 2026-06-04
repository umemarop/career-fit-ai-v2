"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { normalizeApiError } from "@/utils/api-error";

export function ForgotPasswordPageClient() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await authService.forgotPassword({
        email: email.trim(),
      });

      setSuccessMessage(
        "Reset link sent. Please check your inbox for password reset instructions.",
      );
    } catch (error) {
      setErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <MailCheck className="h-6 w-6 text-slate-700" />
      </div>

      <h1 className="text-2xl font-bold text-slate-950">
        Forgot your password?
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Enter the email address associated with your account. We&apos;ll send
        you a secure link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>

          <Input
            id="email"
            type="email"
            value={email}
            disabled={isSubmitting}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2"
          />
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
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
