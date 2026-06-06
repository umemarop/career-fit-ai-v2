import { Suspense } from "react";

import { GoogleOAuthCallbackPageClient } from "@/features/auth/GoogleOAuthCallbackPageClient";

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center text-sm text-slate-500">
          Loading Google sign-in...
        </div>
      }
    >
      <GoogleOAuthCallbackPageClient />
    </Suspense>
  );
}
