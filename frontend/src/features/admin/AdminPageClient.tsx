"use client";

import { AdminStatsCards } from "./components/AdminStatsCards";
import { AdminUserDetailPanel } from "./components/AdminUserDetailPanel";
import { AdminUserFilters } from "./components/AdminUserFilters";
import { AdminUsersTable } from "./components/AdminUsersTable";
import { useAdminPage } from "./hooks/useAdminPage";

export function AdminPageClient() {
  const {
    stats,
    users,
    selectedUser,
    meta,
    filters,
    isInitialLoading,
    isUpdating,
    errorMessage,
    updateFilters,
    searchUsers,
    selectUser,
    changePage,
    updateUserRole,
    updateUserStatus,
  } = useAdminPage();

  return (
    <div className="min-w-0 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Admin Console
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage users, roles, account status, and platform activity.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isInitialLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading admin dashboard...
        </div>
      ) : (
        <>
          <AdminStatsCards stats={stats} />

          <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-4">
              <AdminUserFilters
                filters={filters}
                isUpdating={isUpdating}
                onChangeFilters={updateFilters}
                onSearch={searchUsers}
              />

              <AdminUsersTable
                users={users}
                meta={meta}
                selectedUserId={selectedUser?.id}
                isUpdating={isUpdating}
                onSelectUser={selectUser}
                onChangePage={changePage}
              />
            </div>

            <AdminUserDetailPanel
              user={selectedUser}
              isUpdating={isUpdating}
              onUpdateRole={updateUserRole}
              onUpdateStatus={updateUserStatus}
            />
          </div>
        </>
      )}
    </div>
  );
}
