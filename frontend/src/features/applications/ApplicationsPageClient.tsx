"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { normalizeApiError } from "@/utils/api-error";
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

import { ApplicationDetailCard } from "./components/ApplicationDetailCard";
import { ApplicationFilters } from "./components/ApplicationFilters";
import { ApplicationFormModal } from "./components/ApplicationFormModal";
import { ApplicationsHeader } from "./components/ApplicationsHeader";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { DeleteApplicationModal } from "./components/DeleteApplicationModal";

const APPLICATIONS_LIMIT = 5;

export function ApplicationsPageClient() {
  const searchParams = useSearchParams();
  const selectedApplicationIdFromUrl = searchParams.get("selected");

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
      const application =
        await applicationService.getApplicationById(applicationId);

      setSelectedApplication(application);
    } catch (error) {
      showErrorMessage(normalizeApiError(error).message);
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

      await fetchApplications();
    } catch (error) {
      setDeleteErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ApplicationsHeader
        totalCount={totalCount}
        onAddClick={handleOpenCreateModal}
      />

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <ApplicationFilters
        keyword={keyword}
        status={status}
        sort={sort}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusFilterChange}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
      />

      {isInitialLoading ? (
        <section className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">
            Loading applications...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Fetching your saved applications and progress.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <ApplicationsTable
            applications={applications}
            selectedApplicationId={selectedApplication?.id}
            page={page}
            limit={APPLICATIONS_LIMIT}
            totalCount={totalCount}
            totalPages={totalPages}
            isUpdating={isUpdating}
            onRowClick={fetchApplicationDetail}
            onStatusChange={handleUpdateStatus}
            onEditClick={handleOpenEditModal}
            onDeleteClick={handleOpenDeleteModal}
            onPageChange={handlePageChange}
          />

          {selectedApplication ? (
            <ApplicationDetailCard
              application={selectedApplication}
              onEditClick={handleOpenEditModal}
              onDeleteClick={handleOpenDeleteModal}
            />
          ) : (
            <aside className="rounded-2xl border bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-950">
                No application selected
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Select an application from the list to view its details.
              </p>
            </aside>
          )}
        </div>
      )}

      <ApplicationFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialData={formInitialData}
        isSubmitting={isSubmitting}
        errorMessage={formErrorMessage}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitForm}
      />

      <DeleteApplicationModal
        isOpen={isDeleteOpen}
        application={applicationToDelete}
        isDeleting={isDeleting}
        errorMessage={deleteErrorMessage}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
