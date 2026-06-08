import { Suspense } from "react";

import { ApplicationsPageClient } from "@/features/applications/ApplicationsPageClient";

export default function ApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <ApplicationsPageClient />
    </Suspense>
  );
}
