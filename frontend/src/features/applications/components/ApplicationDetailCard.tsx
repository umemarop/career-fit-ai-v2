import { CalendarDays, ExternalLink, MapPin } from "lucide-react";

import type { Application } from "@/types/application.types";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

type ApplicationDetailCardProps = {
  application: Application;
};

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function ApplicationDetailCard({
  application,
}: ApplicationDetailCardProps) {
  return (
    <aside className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Selected Application
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">
            {application.jobTitle}
          </h2>
        </div>

        <ApplicationStatusBadge status={application.status} />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Company
          </p>
          <p className="mt-1 text-slate-700">
            {application.companyName ?? "Unknown company"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Location
          </p>
          <p className="mt-1 flex items-center gap-2 text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400" />
            {application.location ?? "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Applied At
          </p>
          <p className="mt-1 flex items-center gap-2 text-slate-700">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {formatDate(application.appliedAt)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Job URL
          </p>

          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Open job post
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p className="mt-1 text-slate-500">No job URL added</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Next Step
        </p>
        <p className="mt-2 text-sm text-slate-700">
          {application.nextStep ?? "No next step added yet."}
        </p>
      </div>

      <div className="mt-4 rounded-xl border bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Notes
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {application.notes ?? "No notes added yet."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 border-t pt-5 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Created</span>
          <span>{formatDate(application.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Updated</span>
          <span>{formatDate(application.updatedAt)}</span>
        </div>
      </div>
    </aside>
  );
}
