import type { ProfileFormState } from "@/features/profile/profile-form.utils";
import type { ExperienceLevel, WorkEligibility } from "@/types/profile.types";

type BasicInformationSectionProps = {
  formState: ProfileFormState;
  fieldErrors?: Record<string, string>;
  onChange: <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => void;
};

const experienceLevelOptions: {
  value: ExperienceLevel;
  label: string;
}[] = [
  { value: "ENTRY", label: "Entry" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid" },
  { value: "SENIOR", label: "Senior" },
];

const workEligibilityOptions: {
  value: WorkEligibility;
  label: string;
}[] = [
  { value: "FULL_WORK_RIGHTS", label: "Full work rights" },
  { value: "LIMITED_WORK_RIGHTS", label: "Limited work rights" },
  { value: "NEEDS_SPONSORSHIP", label: "Needs sponsorship" },
  { value: "NOT_SURE", label: "Not sure" },
];

export function BasicInformationSection({
  formState,
  onChange,
  fieldErrors = {},
}: BasicInformationSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Basic information
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Tell us about your current career stage and work eligibility.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Experience level
          </label>
          <select
            value={formState.experienceLevel}
            onChange={(event) =>
              onChange("experienceLevel", event.target.value as ExperienceLevel)
            }
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {experienceLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {fieldErrors.experienceLevel && (
            <p className="mt-2 text-sm text-red-600">
              {fieldErrors.experienceLevel}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Work eligibility
          </label>
          <select
            value={formState.workEligibility}
            onChange={(event) =>
              onChange(
                "workEligibility",
                event.target.value as WorkEligibility | "",
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select work eligibility</option>
            {workEligibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {fieldErrors.workEligibility && (
            <p className="mt-2 text-sm text-red-600">
              {fieldErrors.workEligibility}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Location</label>
          <input
            type="text"
            value={formState.location}
            onChange={(event) => onChange("location", event.target.value)}
            placeholder="Brisbane, Australia"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {fieldErrors.location && (
            <p className="mt-2 text-sm text-red-600">{fieldErrors.location}</p>
          )}
        </div>
      </div>
    </div>
  );
}
