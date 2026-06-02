import { Edit3 } from "lucide-react";

import type { Profile } from "@/types/profile.types";

type ProfileSummaryProps = {
  profile: Profile;
  onEdit: () => void;
  onDelete: () => void;
};

const formatEnumLabel = (value: string | null): string => {
  if (!value) return "Not provided";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function ProfileSummary({
  profile,
  onEdit,
  onDelete,
}: ProfileSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Saved profile</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Your career profile is ready
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            This profile will be used for personalized job analysis and
            application insights.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Edit3 className="h-4 w-4" />
            Edit profile
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50"
          >
            Delete profile
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Experience
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatEnumLabel(profile.experienceLevel)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Work eligibility
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatEnumLabel(profile.workEligibility)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Target role
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {profile.targetRole || "Not provided"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {profile.location || "Not provided"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Preferred job type
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatEnumLabel(profile.preferredJobType)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Remote preference
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatEnumLabel(profile.remotePreference)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-950">Desired roles</p>
        {profile.desiredRoles.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.desiredRoles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {role}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Not provided</p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-950">Skills</p>
        {profile.skills.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Not provided</p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-950">Career goals</p>
        <p className="mt-2 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {profile.careerGoals || "Not provided"}
        </p>
      </div>
    </section>
  );
}
