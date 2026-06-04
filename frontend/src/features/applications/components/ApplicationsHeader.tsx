import { Plus } from "lucide-react";
import { VerifiedActionButton } from "@/components/common/VerifiedActionButton";

type ApplicationsHeaderProps = {
  totalCount: number;
  onAddClick: () => void;
};

export function ApplicationsHeader({
  totalCount,
  onAddClick,
}: ApplicationsHeaderProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-indigo-600">Job Tracker</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Applications
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Track saved jobs, submitted applications, interviews, offers, and your
          next steps in one place.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="rounded-xl border bg-slate-50 px-4 py-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-950">{totalCount}</span>{" "}
          {totalCount === 1 ? "application" : "applications"}
        </div>

        <VerifiedActionButton
          type="button"
          onClick={onAddClick}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </VerifiedActionButton>
      </div>
    </section>
  );
}
