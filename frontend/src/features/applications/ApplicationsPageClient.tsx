"use client";

import { ApplicationDetailCard } from "@/features/applications/components/ApplicationDetailCard";
import { ApplicationFilters } from "@/features/applications/components/ApplicationFilters";
import { ApplicationFormModal } from "@/features/applications/components/ApplicationFormModal";
import { ApplicationsHeader } from "@/features/applications/components/ApplicationsHeader";
import { ApplicationsTable } from "@/features/applications/components/ApplicationsTable";
import { DeleteApplicationModal } from "@/features/applications/components/DeleteApplicationModal";
import { useApplicationsPage } from "@/features/applications/hooks/useApplicationsPage";

export function ApplicationsPageClient() {
  const {
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

    applicationsLimit,
  } = useApplicationsPage();

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
            limit={applicationsLimit}
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
