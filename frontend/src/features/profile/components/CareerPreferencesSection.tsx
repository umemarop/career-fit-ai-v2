import type { ProfileFormState } from "@/features/profile/profile-form.utils";
import type { JobType, RemotePreference } from "@/types/profile.types";

type CareerPreferencesSectionProps = {
  formState: ProfileFormState;
  onChange: <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => void;
};

const jobTypeOptions: {
  value: JobType;
  label: string;
}[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

const remotePreferenceOptions: {
  value: RemotePreference;
  label: string;
}[] = [
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

export function CareerPreferencesSection({
  formState,
  onChange,
}: CareerPreferencesSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Career preferences
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Define the roles and work style you are targeting.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Target role
          </label>
          <input
            type="text"
            value={formState.targetRole}
            onChange={(event) => onChange("targetRole", event.target.value)}
            placeholder="Junior Backend Developer"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Desired roles
          </label>
          <input
            type="text"
            value={formState.desiredRolesText}
            onChange={(event) =>
              onChange("desiredRolesText", event.target.value)
            }
            placeholder="Backend Developer, Node.js Developer"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Preferred job type
          </label>
          <select
            value={formState.preferredJobType}
            onChange={(event) =>
              onChange("preferredJobType", event.target.value as JobType | "")
            }
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select job type</option>
            {jobTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Remote preference
          </label>
          <select
            value={formState.remotePreference}
            onChange={(event) =>
              onChange(
                "remotePreference",
                event.target.value as RemotePreference | "",
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select remote preference</option>
            {remotePreferenceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
