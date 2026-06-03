"use client";

import { CurrentResumeCard } from "@/features/resume/components/CurrentResumeCard";
import { ResumeActions } from "@/features/resume/components/ResumeActions";
import { ResumeHeader } from "@/features/resume/components/ResumeHeader";
import { ResumeUploadSection } from "@/features/resume/components/ResumeUploadSection";
import { SelectedResumePreview } from "@/features/resume/components/SelectedResumePreview";
import { useResumePage } from "@/features/resume/hooks/useResumePage";

export function ResumePageClient() {
  const {
    resume,
    pendingFile,
    pendingPreviewUrl,
    isLoading,
    isUploading,
    isDeleting,
    error,
    handleSelectFile,
    handleCancelPendingFile,
    handleSavePendingFile,
    handleDelete,
  } = useResumePage();

  return (
    <div className="space-y-6">
      <ResumeHeader />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading resume...
        </div>
      ) : (
        <>
          {resume && !pendingFile ? (
            <>
              <CurrentResumeCard resume={resume} />

              <ResumeActions
                isDeleting={isDeleting}
                isUploading={isUploading}
                onDelete={handleDelete}
                onSelectReplacement={handleSelectFile}
              />
            </>
          ) : null}

          {!resume && !pendingFile ? (
            <ResumeUploadSection
              isUploading={isUploading}
              onSelectFile={handleSelectFile}
            />
          ) : null}

          {pendingFile && pendingPreviewUrl ? (
            <SelectedResumePreview
              file={pendingFile}
              previewUrl={pendingPreviewUrl}
              isUploading={isUploading}
              onCancel={handleCancelPendingFile}
              onSave={handleSavePendingFile}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
