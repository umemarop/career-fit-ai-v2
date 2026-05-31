import type { ApplicationStatus } from "@/types/application.types";

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

const statusStyles: Record<ApplicationStatus, string> = {
  SAVED: "border-slate-200 bg-slate-50 text-slate-700",
  APPLIED: "border-indigo-200 bg-indigo-50 text-indigo-700",
  INTERVIEWING: "border-amber-200 bg-amber-50 text-amber-700",
  OFFER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
  WITHDRAWN: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

const statusLabels: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
