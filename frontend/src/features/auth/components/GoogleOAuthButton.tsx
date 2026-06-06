"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { normalizeApiError } from "@/utils/api-error";

type GoogleOAuthButtonProps = {
  onError?: (message: string) => void;
};

export function GoogleOAuthButton({ onError }: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      onError?.("");

      const url = await authService.getGoogleAuthUrl();

      window.location.href = url;
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      onError?.(normalizedError.message);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      onClick={handleGoogleLogin}
      className="h-11 w-full border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Connecting to Google...
        </>
      ) : (
        "Continue with Google"
      )}
    </Button>
  );
}
