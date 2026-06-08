import { Suspense } from "react";

import { VerifyEmailPageClient } from "@/features/auth/VerifyEmailPageClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageClient />
    </Suspense>
  );
}
