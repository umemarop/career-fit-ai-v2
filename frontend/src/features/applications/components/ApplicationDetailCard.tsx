import {
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Application } from "@/types/application.types";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

type ApplicationDetailCardProps = {
  application: Application;
  onEditClick: (applicationId: string) => void;
  onDeleteClick: (applicationId: string) => void;
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
  onEditClick,
  onDeleteClick,
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

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEditClick(application.id)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDeleteClick(application.id)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
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
        <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
          {application.nextStep ?? "No next step added yet."}
        </p>
      </div>

      <div className="mt-4 rounded-xl border bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Notes
        </p>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
          {application.notes ?? "No notes added yet."}
        </p>
      </div>

      {application.jobAnalysisId ? (
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
            Related Analysis
          </p>
          <p className="mt-2 text-sm text-indigo-700">
            This application was created from a saved job analysis.
          </p>
        </div>
      ) : null}

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
