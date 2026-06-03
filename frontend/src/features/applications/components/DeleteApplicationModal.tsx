"use client";

import { AlertTriangle, X } from "lucide-react";

import type { Application } from "@/types/application.types";

type DeleteApplicationModalProps = {
  isOpen: boolean;
  application: Application | null;
  isDeleting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function DeleteApplicationModal({
  isOpen,
  application,
  isDeleting = false,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteApplicationModalProps) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Delete application?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                This will remove the application from your tracker.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="rounded-xl border bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-950">
              {application.jobTitle}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {application.companyName ?? "Unknown company"}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            You can add this application again later, but its current notes,
            status, and next step will no longer appear in your list.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
