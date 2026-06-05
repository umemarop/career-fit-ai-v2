import type {
  AdminRole,
  AdminUserDetail,
  AdminUserStatus,
} from "@/types/admin.types";
import { getAdminUserStatus } from "@/types/admin.types";
import { formatDate, formatFileSize } from "@/utils/format";

type AdminUserDetailPanelProps = {
  user: AdminUserDetail | null;
  isUpdating: boolean;
  onUpdateRole: (userId: string, role: AdminRole) => void;
  onUpdateStatus: (userId: string, status: AdminUserStatus) => void;
};

export function AdminUserDetailPanel({
  user,
  isUpdating,
  onUpdateRole,
  onUpdateStatus,
}: AdminUserDetailPanelProps) {
  if (!user) {
    return (
      <aside className="w-full min-w-0 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        Select a user to view details.
      </aside>
    );
  }

  const status = getAdminUserStatus(user);
  const nextStatus: AdminUserStatus =
    status === "ACTIVE" ? "DISABLED" : "ACTIVE";
  const nextRole: AdminRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  return (
    <aside className="w-full min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">User Detail</h2>
        <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
      </div>

      <div className="grid gap-3 text-sm">
        <DetailRow label="Role" value={user.role} />
        <DetailRow label="Status" value={status} />
        <DetailRow
          label="Verified"
          value={user.isEmailVerified ? "Verified" : "Unverified"}
        />
        <DetailRow label="Created" value={formatDate(user.createdAt)} />
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-950">Profile</h3>

        {user.profile ? (
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <DetailRow
              label="Experience"
              value={user.profile.experienceLevel}
            />
            <DetailRow
              label="Target role"
              value={user.profile.targetRole || "Not provided"}
            />
            <DetailRow
              label="Location"
              value={user.profile.location || "Not provided"}
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No profile found.</p>
        )}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-950">Resume</h3>

        {user.resume ? (
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <DetailRow label="File" value={user.resume.originalName} />
            <DetailRow label="Size" value={formatFileSize(user.resume.size)} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No resume found.</p>
        )}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-950">Activity</h3>

        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          <DetailRow
            label="Applications"
            value={String(user.counts.applications)}
          />
          <DetailRow label="Analyses" value={String(user.counts.jobAnalyses)} />
          <DetailRow
            label="Active sessions"
            value={String(user.counts.activeSessions)}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-950">Admin Actions</h3>

        <div className="mt-3 grid gap-2">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateRole(user.id, nextRole)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Change role to {nextRole}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(user.id, nextStatus)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              nextStatus === "DISABLED"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {nextStatus === "DISABLED" ? "Disable user" : "Enable user"}
          </button>
        </div>
      </div>
    </aside>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="min-w-0 break-words text-right font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}
