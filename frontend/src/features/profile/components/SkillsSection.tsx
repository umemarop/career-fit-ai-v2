const mockSkills = ["Node.js", "Express", "TypeScript", "PostgreSQL", "Prisma"];

export function SkillsSection() {
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
          placeholder="Node.js, Express, PostgreSQL, Prisma"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mockSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
