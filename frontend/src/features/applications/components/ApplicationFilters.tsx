import { Search, X } from "lucide-react";

import type {
  ApplicationSort,
  ApplicationStatus,
} from "@/types/application.types";

type ApplicationFiltersProps = {
  keyword: string;
  status: ApplicationStatus | "ALL";
  sort: ApplicationSort;
  onKeywordChange: (value: string) => void;
  onStatusChange: (value: ApplicationStatus | "ALL") => void;
  onSortChange: (value: ApplicationSort) => void;
  onReset: () => void;
};

const statusOptions: Array<{
  label: string;
  value: ApplicationStatus | "ALL";
}> = [
  { label: "All Statuses", value: "ALL" },
  { label: "Saved", value: "SAVED" },
  { label: "Applied", value: "APPLIED" },
  { label: "Interviewing", value: "INTERVIEWING" },
  { label: "Offer", value: "OFFER" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

const sortOptions: Array<{
  label: string;
  value: ApplicationSort;
}> = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Applied date: newest", value: "appliedAt_desc" },
  { label: "Applied date: oldest", value: "appliedAt_asc" },
  { label: "Job title A-Z", value: "jobTitle_asc" },
  { label: "Company A-Z", value: "companyName_asc" },
];

export function ApplicationFilters({
  keyword,
  status,
  sort,
  onKeywordChange,
  onStatusChange,
  onSortChange,
  onReset,
}: ApplicationFiltersProps) {
  const hasActiveFilters = keyword.trim().length > 0 || status !== "ALL";

  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_220px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search by role, company, or location"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
          />
        </label>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ApplicationStatus | "ALL")
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as ApplicationSort)
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters && sort === "latest"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
}
