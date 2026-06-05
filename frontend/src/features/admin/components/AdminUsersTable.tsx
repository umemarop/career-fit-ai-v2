import type { AdminUser, AdminUsersMeta } from "@/types/admin.types";
import { getAdminUserStatus } from "@/types/admin.types";
import { formatDate } from "@/utils/format";

type AdminUsersTableProps = {
  users: AdminUser[];
  meta: AdminUsersMeta | null;
  selectedUserId?: string;
  isUpdating: boolean;
  onSelectUser: (userId: string) => void;
  onChangePage: (page: number) => void;
};

export function AdminUsersTable({
  users,
  meta,
  selectedUserId,
  isUpdating,
  onSelectUser,
  onChangePage,
}: AdminUsersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Users</h2>
        <p className="mt-1 text-sm text-slate-500">
          Search, review, and manage registered users.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Verified</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const status = getAdminUserStatus(user);
                const isSelected = selectedUserId === user.id;

                return (
                  <tr
                    key={user.id}
                    onClick={() => onSelectUser(user.id)}
                    className={`cursor-pointer transition hover:bg-slate-50 ${
                      isSelected ? "bg-indigo-50" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-slate-950">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.isEmailVerified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {meta ? (
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm">
          <p className="text-slate-500">
            Page {meta.page} of {meta.totalPages || 1} · {meta.total} users
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!meta.hasPrevPage || isUpdating}
              onClick={() => onChangePage(meta.page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            <button
              type="button"
              disabled={!meta.hasNextPage || isUpdating}
              onClick={() => onChangePage(meta.page + 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
