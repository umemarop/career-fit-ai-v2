import { useEffect, useState } from "react";
import { Eye, FileText } from "lucide-react";

import type { Resume } from "@/types/resume.types";
import { getPublicFileUrl } from "@/utils/file-url";
import { formatDate, formatFileSize } from "@/utils/format";

type CurrentResumeCardProps = {
  resume: Resume;
};

export function CurrentResumeCard({ resume }: CurrentResumeCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const publicFileUrl = getPublicFileUrl(resume.fileUrl);

  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  async function handleTogglePreview() {
    if (isPreviewOpen) {
      setIsPreviewOpen(false);
      return;
    }

    if (!publicFileUrl) {
      return;
    }

    setIsPreviewOpen(true);

    if (previewBlobUrl) {
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError(null);

    try {
      const response = await fetch(publicFileUrl);

      if (!response.ok) {
        throw new Error("Unable to load resume preview.");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      setPreviewBlobUrl(blobUrl);
    } catch {
      setPreviewError("Unable to load resume preview.");
    } finally {
      setIsPreviewLoading(false);
    }
  }

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

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  File name
                </p>
                <p className="mt-1 truncate text-sm font-medium text-slate-800">
                  {resume.originalName}
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
                  {formatFileSize(resume.size)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Uploaded
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formatDate(resume.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Text extracted
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {resume.rawText ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {publicFileUrl ? (
              <button
                type="button"
                onClick={handleTogglePreview}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" />
                {isPreviewOpen ? "Hide resume" : "View resume"}
              </button>
            ) : null}
          </div>
        </div>

        <span className="inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Uploaded
        </span>
      </div>

      {isPreviewOpen ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {isPreviewLoading ? (
            <div className="flex h-[520px] items-center justify-center text-sm text-slate-500">
              Loading resume preview...
            </div>
          ) : previewError ? (
            <div className="flex h-[520px] items-center justify-center text-sm text-red-600">
              {previewError}
            </div>
          ) : previewBlobUrl ? (
            <iframe
              src={previewBlobUrl}
              title="Current resume preview"
              className="h-[520px] w-full"
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
