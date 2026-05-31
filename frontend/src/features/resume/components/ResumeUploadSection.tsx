import { FileUp } from "lucide-react";

export function ResumeUploadSection() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <FileUp className="h-7 w-7 text-indigo-600" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-slate-950">
          Upload your resume
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Drag and drop your PDF resume here, or browse your files to upload the
          latest version.
        </p>

        <button
          type="button"
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Browse file
        </button>

        <p className="mt-3 text-xs text-slate-400">
          PDF only. Recommended file size under 5MB.
        </p>
      </div>
    </section>
  );
}
