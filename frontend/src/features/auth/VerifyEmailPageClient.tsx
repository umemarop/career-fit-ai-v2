"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { normalizeApiError } from "@/utils/api-error";
import { useAuth } from "./useAuth";

type VerifyStatus = "verifying" | "success" | "error";

export function VerifyEmailPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  const token = searchParams.get("token");
  const verifiedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification link is invalid or expired.");
        return;
      }

      if (verifiedTokenRef.current === token) {
        return;
      }

      verifiedTokenRef.current = token;

      try {
        const response = await authService.verifyEmail(token);

        await refreshUser();

        setStatus("success");
        setMessage(response.message || "Your account is now fully activated.");
      } catch (error) {
        setStatus("error");
        setMessage(normalizeApiError(error).message);
      }
    };

    verifyEmail();
  }, [token, refreshUser]);

  const isVerifying = status === "verifying";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          {isVerifying && (
            <Loader2 className="h-7 w-7 animate-spin text-slate-500" />
          )}

          {isSuccess && <CheckCircle2 className="h-7 w-7 text-emerald-600" />}

          {isError && <XCircle className="h-7 w-7 text-red-500" />}
        </div>

        <h1 className="text-2xl font-bold text-slate-950">
          {isVerifying && "Verifying your email..."}
          {isSuccess && "Email verified successfully"}
          {isError && "Verification failed"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-8">
          {isSuccess && (
            <Button
              type="button"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          )}

          {isError && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
