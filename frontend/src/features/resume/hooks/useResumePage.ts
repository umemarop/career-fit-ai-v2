"use client";

import { useEffect, useState } from "react";

import { resumeService } from "@/services/resume.service";
import type { Resume } from "@/types/resume.types";
import { normalizeApiError } from "@/utils/api-error";

export function useResumePage() {
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

  function revokePendingPreviewUrl() {
    if (!pendingPreviewUrl) {
      return;
    }

    URL.revokeObjectURL(pendingPreviewUrl);
    setPendingPreviewUrl(null);
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
    revokePendingPreviewUrl();
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
      revokePendingPreviewUrl();
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

  return {
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
  };
}
