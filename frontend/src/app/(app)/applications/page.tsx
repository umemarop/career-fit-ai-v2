import { ApplicationDetailCard } from "@/features/applications/components/ApplicationDetailCard";
import { ApplicationFilters } from "@/features/applications/components/ApplicationFilters";
import { ApplicationsHeader } from "@/features/applications/components/ApplicationsHeader";
import { ApplicationsTable } from "@/features/applications/components/ApplicationsTable";
import { mockApplications } from "@/features/applications/mock-applications";

export default function ApplicationsPage() {
  const selectedApplication = mockApplications[0];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ApplicationsHeader totalCount={mockApplications.length} />

      <ApplicationFilters />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <ApplicationsTable applications={mockApplications} />
        <ApplicationDetailCard application={selectedApplication} />
      </section>
    </main>
  );
}
