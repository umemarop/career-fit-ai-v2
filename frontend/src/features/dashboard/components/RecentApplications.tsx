import Link from "next/link";

import type {
  ApplicationListItem,
  ApplicationStatus,
} from "@/types/application.types";

type RecentApplicationsProps = {
  applications: ApplicationListItem[];
};

const statusLabelMap: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const statusClassNameMap: Record<ApplicationStatus, string> = {
  SAVED: "border-slate-200 bg-slate-50 text-slate-700",
  APPLIED: "border-blue-200 bg-blue-50 text-blue-700",
  INTERVIEWING: "border-indigo-200 bg-indigo-50 text-indigo-700",
  OFFER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  WITHDRAWN: "border-slate-200 bg-slate-50 text-slate-500",
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const hasApplications = applications.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-950">
          Recent Applications
        </h3>

        <Link
          href="/applications"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          View all
        </Link>
      </div>

      {hasApplications ? (
        <div className="mt-4 divide-y divide-slate-100">
          {applications.map((application) => (
            <Link
              key={application.id}
              href={`/applications?selected=${application.id}`}
              className="block py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-950">
                    {application.jobTitle}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {application.companyName || "Company not provided"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
                    statusClassNameMap[application.status]
                  }`}
                >
                  {statusLabelMap[application.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-700">
            No applications yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Create applications from analyses or track them manually.
          </p>

          <Link
            href="/applications"
            className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Manage applications
          </Link>
        </div>
      )}
    </div>
  );
}
