"use client";

import { useEffect, useState } from "react";

import { CurrentResumeCard } from "@/features/resume/components/CurrentResumeCard";
import { ResumeActions } from "@/features/resume/components/ResumeActions";
import { ResumeHeader } from "@/features/resume/components/ResumeHeader";
import { ResumeUploadSection } from "@/features/resume/components/ResumeUploadSection";
import { SelectedResumePreview } from "@/features/resume/components/SelectedResumePreview";
import { resumeService } from "@/services/resume.service";
import type { Resume } from "@/types/resume.types";
import { normalizeApiError } from "@/utils/api-error";

export function ResumePageClient() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadResume() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await resumeService.getResume();
      setResume(data.resume);
    } catch (error) {
      const normalizedError = normalizeApiError(error);

      if (normalizedError.statusCode === 404) {
        setResume(null);
        return;
      }

      setError(normalizedError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectFile(file: File) {
    setError(null);
    setPendingFile(file);

    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPendingPreviewUrl(nextPreviewUrl);
  }

  function handleCancelPendingFile() {
    setPendingFile(null);

    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
      setPendingPreviewUrl(null);
    }
  }

  async function handleSavePendingFile() {
    if (!pendingFile) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const data = await resumeService.uploadResume(pendingFile);

      setResume(data.resume);
      setPendingFile(null);

      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
        setPendingPreviewUrl(null);
      }
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setError(normalizedError.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your resume?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await resumeService.deleteResume();

      setResume(null);
      handleCancelPendingFile();
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setError(normalizedError.message);
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    loadResume();
  }, []);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, [pendingPreviewUrl]);

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
