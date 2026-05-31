import { FileText } from "lucide-react";

const mockResume = {
  originalName: "sanghoon-backend-developer-resume.pdf",
  mimeType: "application/pdf",
  size: "2.1 MB",
  uploadedAt: "May 30, 2026",
  updatedAt: "May 30, 2026",
};

export function CurrentResumeCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <FileText className="h-6 w-6 text-slate-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Current resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your uploaded resume is saved and ready to be used in CareerFit
              AI.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  File name
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-800">
                  {mockResume.originalName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  File type
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">PDF</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  File size
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {mockResume.size}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Uploaded
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {mockResume.uploadedAt}
                </p>
              </div>
            </div>
          </div>
        </div>

        <span className="inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Uploaded
        </span>
      </div>
    </section>
  );
}
