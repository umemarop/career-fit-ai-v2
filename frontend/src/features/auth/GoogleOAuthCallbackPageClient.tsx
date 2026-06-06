"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/features/auth/useAuth";
import { authService } from "@/services/auth.service";
import { normalizeApiError } from "@/utils/api-error";

export function GoogleOAuthCallbackPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOAuthLogin } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setErrorMessage("Google authorization code is missing.");
      return;
    }

    const completeLogin = async () => {
      try {
        const result = await authService.loginWithGoogleCode(code);

        completeOAuthLogin({
          user: result.user,
          accessToken: result.accessToken,
        });

        router.replace("/dashboard");
      } catch (error) {
        const normalizedError = normalizeApiError(error);
        setErrorMessage(normalizedError.message);
      }
    };

    completeLogin();
  }, [searchParams, completeOAuthLogin, router]);

  if (errorMessage) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-slate-950">
          Google sign-in failed
        </h1>
        <p className="text-sm text-red-600">{errorMessage}</p>
        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="text-sm font-medium text-slate-950 hover:underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <Loader2 className="size-6 animate-spin text-slate-500" />
      <div>
        <h1 className="text-xl font-semibold text-slate-950">
          Signing you in with Google
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}
