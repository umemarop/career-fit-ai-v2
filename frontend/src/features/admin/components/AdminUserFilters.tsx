import type {
  AdminRole,
  AdminUsersSort,
  AdminUserStatus,
  AdminVerifiedFilter,
} from "@/types/admin.types";

type AdminFilters = {
  keyword: string;
  role: "ALL" | AdminRole;
  verified: AdminVerifiedFilter;
  status: "ALL" | AdminUserStatus;
  sort: AdminUsersSort;
};

type AdminUserFiltersProps = {
  filters: AdminFilters;
  isUpdating: boolean;
  onChangeFilters: (filters: Partial<AdminFilters>) => void;
  onSearch: () => void;
};

export function AdminUserFilters({
  filters,
  isUpdating,
  onChangeFilters,
  onSearch,
}: AdminUserFiltersProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <input
          value={filters.keyword}
          onChange={(event) => onChangeFilters({ keyword: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Search by email"
          className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        <select
          value={filters.role}
          onChange={(event) =>
            onChangeFilters({
              role: event.target.value as AdminFilters["role"],
            })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="ALL">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <select
          value={filters.verified}
          onChange={(event) =>
            onChangeFilters({
              verified: event.target.value as AdminVerifiedFilter,
            })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="ALL">All verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="UNVERIFIED">Unverified</option>
        </select>

        <select
          value={filters.status}
          onChange={(event) =>
            onChangeFilters({
              status: event.target.value as AdminFilters["status"],
            })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="ALL">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </select>

        <select
          value={filters.sort}
          onChange={(event) =>
            onChangeFilters({
              sort: event.target.value as AdminUsersSort,
            })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="email_asc">Email A-Z</option>
          <option value="email_desc">Email Z-A</option>
          <option value="role_asc">Role A-Z</option>
          <option value="role_desc">Role Z-A</option>
        </select>

        <button
          type="button"
          disabled={isUpdating}
          onClick={onSearch}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Search
        </button>
      </div>
    </section>
  );
}
