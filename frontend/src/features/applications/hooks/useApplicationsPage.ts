"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { applicationService } from "@/services/application.service";
import type {
  Application,
  ApplicationFormInitialData,
  ApplicationFormMode,
  ApplicationListItem,
  ApplicationSort,
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/types/application.types";
import { normalizeApiError } from "@/utils/api-error";

const APPLICATIONS_LIMIT = 5;

export function useApplicationsPage() {
  const searchParams = useSearchParams();
  const selectedApplicationIdFromUrl = searchParams.get("selected");

  const selectedApplicationIdRef = useRef<string | null>(null);

  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "ALL">("ALL");
  const [sort, setSort] = useState<ApplicationSort>("latest");

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ApplicationFormMode>("create");
  const [formInitialData, setFormInitialData] =
    useState<ApplicationFormInitialData | null>(null);
  const [editingApplicationId, setEditingApplicationId] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(
    null,
  );

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    window.setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
  };

  const fetchApplicationDetail = useCallback(async (applicationId: string) => {
    try {
      selectedApplicationIdRef.current = applicationId;

      const application =
        await applicationService.getApplicationById(applicationId);

      setSelectedApplication(application);
    } catch (error) {
      showErrorMessage(normalizeApiError(error).message);
      setSelectedApplication(null);
      selectedApplicationIdRef.current = null;
    }
  }, []);

  const fetchApplications = useCallback(
    async (options?: {
      initial?: boolean;
      preferredSelectedId?: string | null;
    }) => {
      try {
        if (options?.initial) {
          setIsInitialLoading(true);
        } else {
          setIsUpdating(true);
        }

        setErrorMessage(null);

        const response = await applicationService.getApplications({
          page,
          limit: APPLICATIONS_LIMIT,
          keyword: keyword.trim() || undefined,
          status: status === "ALL" ? undefined : status,
          sort,
        });

        setApplications(response.data);
        setTotalCount(response.meta.total);
        setTotalPages(response.meta.totalPages || 1);

        if (options?.preferredSelectedId) {
          await fetchApplicationDetail(options.preferredSelectedId);
          return;
        }

        if (response.data.length === 0) {
          setSelectedApplication(null);
          selectedApplicationIdRef.current = null;
          return;
        }

        const currentSelectedId = selectedApplicationIdRef.current;
        const shouldKeepSelected =
          currentSelectedId &&
          response.data.some(
            (application) => application.id === currentSelectedId,
          );

        if (shouldKeepSelected) {
          return;
        }

        await fetchApplicationDetail(response.data[0].id);
      } catch (error) {
        showErrorMessage(normalizeApiError(error).message);
      } finally {
        setIsInitialLoading(false);
        setIsUpdating(false);
      }
    },
    [fetchApplicationDetail, keyword, page, sort, status],
  );

  useEffect(() => {
    if (selectedApplicationIdFromUrl) {
      selectedApplicationIdRef.current = selectedApplicationIdFromUrl;

      setPage(1);
      setKeyword("");
      setStatus("ALL");
      setSort("latest");

      fetchApplications({
        initial: true,
        preferredSelectedId: selectedApplicationIdFromUrl,
      });

      return;
    }

    fetchApplications({ initial: true });
  }, [fetchApplications, selectedApplicationIdFromUrl]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
    setSuccessMessage(null);
  };

  const handleStatusFilterChange = (value: ApplicationStatus | "ALL") => {
    setStatus(value);
    setPage(1);
    setSuccessMessage(null);
  };

  const handleSortChange = (value: ApplicationSort) => {
    setSort(value);
    setPage(1);
    setSuccessMessage(null);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setStatus("ALL");
    setSort("latest");
    setPage(1);
    setSuccessMessage(null);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setSuccessMessage(null);
  };

  const handleOpenCreateModal = () => {
    clearMessages();
    setFormMode("create");
    setFormInitialData(null);
    setEditingApplicationId(null);
    setFormErrorMessage(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = async (applicationId: string) => {
    clearMessages();
    setFormMode("edit");
    setEditingApplicationId(applicationId);
    setFormErrorMessage(null);

    try {
      const application =
        await applicationService.getApplicationById(applicationId);

      setSelectedApplication(application);
      selectedApplicationIdRef.current = application.id;
      setFormInitialData(application);
      setIsFormOpen(true);
    } catch (error) {
      showErrorMessage(normalizeApiError(error).message);
    }
  };

  const handleCloseFormModal = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setFormErrorMessage(null);
    setFormInitialData(null);
    setEditingApplicationId(null);
  };

  const handleSubmitForm = async (
    input: CreateApplicationInput | UpdateApplicationInput,
  ) => {
    try {
      setIsSubmitting(true);
      setFormErrorMessage(null);
      setSuccessMessage(null);

      if (formMode === "edit") {
        if (!editingApplicationId) return;

        const updatedApplication = await applicationService.updateApplication(
          editingApplicationId,
          input as UpdateApplicationInput,
        );

        setSelectedApplication(updatedApplication);
        selectedApplicationIdRef.current = updatedApplication.id;
        showSuccessMessage("Application updated successfully.");
        setIsFormOpen(false);

        await fetchApplications({
          preferredSelectedId: updatedApplication.id,
        });

        return;
      }

      const createdApplication = await applicationService.createApplication(
        input as CreateApplicationInput,
      );

      showSuccessMessage("Application created successfully.");
      setIsFormOpen(false);
      setPage(1);

      await fetchApplications({
        preferredSelectedId: createdApplication.id,
      });
    } catch (error) {
      setFormErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (
    applicationId: string,
    nextStatus: ApplicationStatus,
  ) => {
    try {
      setIsUpdating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const updatedApplication =
        await applicationService.updateApplicationStatus(applicationId, {
          status: nextStatus,
        });

      setApplications((current) =>
        current.map((application) =>
          application.id === updatedApplication.id
            ? {
                ...application,
                status: updatedApplication.status,
                updatedAt: updatedApplication.updatedAt,
              }
            : application,
        ),
      );

      setSelectedApplication((current) =>
        current?.id === updatedApplication.id ? updatedApplication : current,
      );

      selectedApplicationIdRef.current = updatedApplication.id;
      showSuccessMessage("Application status updated.");
    } catch (error) {
      showErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenDeleteModal = async (applicationId: string) => {
    clearMessages();
    setDeleteErrorMessage(null);

    try {
      const application =
        await applicationService.getApplicationById(applicationId);

      setApplicationToDelete(application);
      setIsDeleteOpen(true);
    } catch (error) {
      showErrorMessage(normalizeApiError(error).message);
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteOpen(false);
    setApplicationToDelete(null);
    setDeleteErrorMessage(null);
  };

  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteErrorMessage(null);
      setSuccessMessage(null);

      await applicationService.deleteApplication(applicationToDelete.id);

      showSuccessMessage("Application deleted successfully.");
      setIsDeleteOpen(false);
      setApplicationToDelete(null);

      if (selectedApplicationIdRef.current === applicationToDelete.id) {
        selectedApplicationIdRef.current = null;
      }

      await fetchApplications();
    } catch (error) {
      setDeleteErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    applications,
    selectedApplication,
    page,
    totalCount,
    totalPages,
    keyword,
    status,
    sort,

    isInitialLoading,
    isUpdating,

    errorMessage,
    successMessage,

    isFormOpen,
    formMode,
    formInitialData,
    isSubmitting,
    formErrorMessage,

    isDeleteOpen,
    applicationToDelete,
    isDeleting,
    deleteErrorMessage,

    handleKeywordChange,
    handleStatusFilterChange,
    handleSortChange,
    handleResetFilters,
    handlePageChange,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseFormModal,
    handleSubmitForm,
    handleUpdateStatus,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    fetchApplicationDetail,

    applicationsLimit: APPLICATIONS_LIMIT,
  };
}
