import Link from "next/link";
import { MailWarning } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmailVerificationBannerProps = {
  email: string;
  isSending: boolean;
  message: {
    type: "success" | "error";
    message: string;
  } | null;
  onResend: () => Promise<void>;
};

export function EmailVerificationBanner({
  email,
  isSending,
  message,
  onResend,
}: EmailVerificationBannerProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600">
            <MailWarning className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-amber-950">
              Verify your email to unlock all features
            </h2>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              We sent a verification link to{" "}
              <span className="font-semibold">{email}</span>. Check your inbox
              and click the link to enable Career Profile, Resume, Analysis, and
              Applications.
            </p>

            {message ? (
              <p
                className={`mt-2 text-sm ${
                  message.type === "success"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {message.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResend}
            disabled={isSending}
            className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
          >
            {isSending ? "Sending..." : "Resend verification"}
          </Button>
        </div>
      </div>
    </section>
  );
}
