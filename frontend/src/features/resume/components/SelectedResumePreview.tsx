import { FileText, X } from "lucide-react";

import { formatFileSize } from "@/utils/format";

type SelectedResumePreviewProps = {
  file: File;
  previewUrl: string;
  isUploading: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export function SelectedResumePreview({
  file,
  previewUrl,
  isUploading,
  onSave,
  onCancel,
}: SelectedResumePreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Review selected resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please check the selected PDF before saving it to your account.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  File name
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-800">
                  {file.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  File size
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Cancel selected resume"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <iframe
          src={previewUrl}
          title="Selected resume preview"
          className="h-[520px] w-full"
        />
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isUploading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Saving..." : "Save resume"}
        </button>
      </div>
    </section>
  );
}
