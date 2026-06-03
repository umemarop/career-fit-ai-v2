"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatDateInputValue } from "@/utils/format";
import type {
  ApplicationFormInitialData,
  ApplicationFormMode,
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/types/application.types";

type ApplicationFormValues = {
  jobTitle: string;
  companyName: string;
  location: string;
  jobUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  nextStep: string;
  notes: string;
};

type ApplicationFormModalProps = {
  isOpen: boolean;
  mode: ApplicationFormMode;
  initialData?: ApplicationFormInitialData | null;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (
    input: CreateApplicationInput | UpdateApplicationInput,
  ) => Promise<void> | void;
};

const defaultValues: ApplicationFormValues = {
  jobTitle: "",
  companyName: "",
  location: "",
  jobUrl: "",
  status: "SAVED",
  appliedAt: "",
  nextStep: "",
  notes: "",
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

function nullableString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function ApplicationFormModal({
  isOpen,
  mode,
  initialData,
  isSubmitting = false,
  errorMessage,
  onClose,
  onSubmit,
}: ApplicationFormModalProps) {
  const [values, setValues] = useState<ApplicationFormValues>(defaultValues);

  const isEditMode = mode === "edit";
  const isFromAnalysis = Boolean(initialData?.jobAnalysisId);

  useEffect(() => {
    if (!isOpen) return;

    setValues({
      jobTitle: initialData?.jobTitle ?? "",
      companyName: initialData?.companyName ?? "",
      location: initialData?.location ?? "",
      jobUrl: initialData?.jobUrl ?? "",
      status: initialData?.status ?? "SAVED",
      appliedAt: formatDateInputValue(initialData?.appliedAt),
      nextStep: initialData?.nextStep ?? "",
      notes: initialData?.notes ?? "",
    });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ApplicationFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditMode) {
      const updateInput: UpdateApplicationInput = {
        jobTitle: values.jobTitle.trim(),
        companyName: nullableString(values.companyName),
        location: nullableString(values.location),
        jobUrl: nullableString(values.jobUrl),
        appliedAt: values.appliedAt || null,
        nextStep: nullableString(values.nextStep),
        notes: nullableString(values.notes),
      };

      await onSubmit(updateInput);
      return;
    }

    const createInput: CreateApplicationInput = {
      jobAnalysisId: initialData?.jobAnalysisId ?? undefined,
      jobTitle: optionalString(values.jobTitle),
      companyName: optionalString(values.companyName),
      location: optionalString(values.location),
      jobUrl: optionalString(values.jobUrl),
      status: values.status,
      appliedAt: values.appliedAt || undefined,
      nextStep: optionalString(values.nextStep),
      notes: optionalString(values.notes),
    };

    await onSubmit(createInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              {isEditMode ? "Edit Application" : "New Application"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {isEditMode
                ? "Update application details"
                : isFromAnalysis
                  ? "Add application from analysis"
                  : "Add application manually"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isFromAnalysis
                ? "Some fields are prefilled from the selected analysis. You can still edit the details before saving."
                : "Track the role, company, status, next step, and notes for this application."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          {errorMessage ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {isFromAnalysis ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              This application was prefilled from a job analysis. Review and
              adjust the details before saving.
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Job Title <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                value={values.jobTitle}
                onChange={(event) =>
                  handleChange("jobTitle", event.target.value)
                }
                required={!initialData?.jobAnalysisId}
                placeholder="Junior Backend Developer"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Company
              </span>
              <input
                type="text"
                value={values.companyName}
                onChange={(event) =>
                  handleChange("companyName", event.target.value)
                }
                placeholder="TechNova"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Location
              </span>
              <input
                type="text"
                value={values.location}
                onChange={(event) =>
                  handleChange("location", event.target.value)
                }
                placeholder="Brisbane, Australia"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Job URL
              </span>
              <input
                type="url"
                value={values.jobUrl}
                onChange={(event) => handleChange("jobUrl", event.target.value)}
                placeholder="https://company.com/jobs/backend"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={values.status}
                onChange={(event) => handleChange("status", event.target.value)}
                disabled={isEditMode}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {isEditMode ? (
                <p className="mt-2 text-xs text-slate-500">
                  Change status directly from the table.
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Applied Date
              </span>
              <input
                type="date"
                value={values.appliedAt}
                onChange={(event) =>
                  handleChange("appliedAt", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Next Step
            </span>
            <input
              type="text"
              value={values.nextStep}
              onChange={(event) => handleChange("nextStep", event.target.value)}
              placeholder="Follow up next Monday"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Notes</span>
            <textarea
              value={values.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              rows={4}
              placeholder="Add interview notes, recruiter details, or preparation points..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
