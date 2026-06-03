import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import type {
  ApplicationListItem,
  ApplicationStatus,
} from "@/types/application.types";

type ApplicationsTableProps = {
  applications: ApplicationListItem[];
  selectedApplicationId?: string | null;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  isUpdating?: boolean;
  onRowClick: (applicationId: string) => void;
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
  onEditClick: (applicationId: string) => void;
  onDeleteClick: (applicationId: string) => void;
  onPageChange: (page: number) => void;
};

const statusOptions: Array<{
  label: string;
  value: ApplicationStatus;
}> = [
  { label: "Saved", value: "SAVED" },
  { label: "Applied", value: "APPLIED" },
  { label: "Interviewing", value: "INTERVIEWING" },
  { label: "Offer", value: "OFFER" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

function formatDate(date?: string | null) {
  if (!date) return "Not applied yet";

  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function ApplicationsTable({
  applications,
  selectedApplicationId,
  page,
  limit,
  totalCount,
  totalPages,
  isUpdating = false,
  onRowClick,
  onStatusChange,
  onEditClick,
  onDeleteClick,
  onPageChange,
}: ApplicationsTableProps) {
  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Application List
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review your saved jobs, submitted applications, and current
            progress.
          </p>
        </div>

        {isUpdating ? (
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Updating...
          </span>
        ) : null}
      </div>

      {applications.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <h3 className="text-sm font-semibold text-slate-950">
            No applications found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Add your first application or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Applied At</th>
                <th className="px-5 py-3 font-medium">Next Step</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {applications.map((application) => {
                const isSelected = application.id === selectedApplicationId;

                return (
                  <tr
                    key={application.id}
                    onClick={() => onRowClick(application.id)}
                    className={`cursor-pointer transition ${
                      isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-4 align-top">
                      <div>
                        <p className="font-medium text-slate-950">
                          {application.jobTitle}
                        </p>

                        {application.jobUrl ? (
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            View job post
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="mt-1 text-xs text-slate-400">
                            No job URL
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top text-slate-600">
                      {application.companyName ?? "Unknown company"}
                    </td>

                    <td className="px-5 py-4 align-top text-slate-600">
                      {application.location ?? "Not specified"}
                    </td>

                    <td className="px-5 py-4 align-top">
                      <select
                        value={application.status}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          onStatusChange(
                            application.id,
                            event.target.value as ApplicationStatus,
                          )
                        }
                        className="h-9 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4 align-top text-slate-600">
                      {formatDate(application.appliedAt)}
                    </td>

                    <td className="max-w-[220px] px-5 py-4 align-top text-slate-600">
                      <p className="line-clamp-2">
                        {application.nextStep ?? "No next step"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditClick(application.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                          aria-label="Edit application"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteClick(application.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-white text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">{startItem}</span>-
          <span className="font-medium text-slate-700">{endItem}</span> of{" "}
          <span className="font-medium text-slate-700">{totalCount}</span>
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1 || isUpdating}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={page >= totalPages || isUpdating}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
