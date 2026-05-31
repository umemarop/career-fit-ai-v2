import type { Application } from "@/types/application.types";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

type ApplicationsTableProps = {
  applications: Application[];
};

function formatDate(date?: string | null) {
  if (!date) return "Not applied yet";

  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Application List
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review your saved jobs, submitted applications, and current progress.
        </p>
      </div>

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
            </tr>
          </thead>

          <tbody className="divide-y">
            {applications.map((application) => (
              <tr key={application.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-950">
                      {application.jobTitle}
                    </p>

                    {application.jobUrl ? (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-indigo-600 hover:text-indigo-700"
                      >
                        View job post
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">No job URL</p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {application.companyName ?? "Unknown company"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {application.location ?? "Not specified"}
                </td>

                <td className="px-5 py-4">
                  <ApplicationStatusBadge status={application.status} />
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {formatDate(application.appliedAt)}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {application.nextStep ?? "No next step"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">1</span>-
          <span className="font-medium text-slate-700">
            {applications.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {applications.length}
          </span>
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-400"
          >
            Previous
          </button>

          <button
            type="button"
            disabled
            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-400"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
