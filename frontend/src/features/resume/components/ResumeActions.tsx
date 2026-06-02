import { useRef } from "react";
import { RefreshCw, Trash2 } from "lucide-react";

type ResumeActionsProps = {
  onSelectReplacement: (file: File) => void;
  onDelete: () => void;
  isUploading: boolean;
  isDeleting: boolean;
};

export function ResumeActions({
  onSelectReplacement,
  onDelete,
  isUploading,
  isDeleting,
}: ResumeActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleReplaceClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      return;
    }

    onSelectReplacement(file);

    event.target.value = "";
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Resume actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Replace your resume when you have a newer version, or delete the
            current one from your account.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReplaceClick}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            {isUploading ? "Saving..." : "Replace"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </section>
  );
}
