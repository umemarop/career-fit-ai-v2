import { Suspense } from "react";

import { ResetPasswordPageClient } from "@/features/auth/ResetPasswordPageClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
