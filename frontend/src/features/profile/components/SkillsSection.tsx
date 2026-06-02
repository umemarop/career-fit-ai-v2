import type { ProfileFormState } from "@/features/profile/profile-form.utils";

type SkillsSectionProps = {
  formState: ProfileFormState;
  onChange: <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => void;
  errorMessage?: string;
};

const getSkillTags = (skillsText: string): string[] => {
  return skillsText
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export function SkillsSection({
  formState,
  onChange,
  errorMessage,
}: SkillsSectionProps) {
  const skillTags = getSkillTags(formState.skillsText);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Skills</h2>
      <p className="mt-1 text-sm text-slate-500">
        Add the main technical skills you want CareerFit AI to consider.
      </p>

      <div className="mt-6">
        <label className="text-sm font-medium text-slate-700">Skills</label>
        <input
          type="text"
          value={formState.skillsText}
          onChange={(event) => onChange("skillsText", event.target.value)}
          placeholder="Node.js, Express, PostgreSQL, Prisma"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      {skillTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skillTags.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
