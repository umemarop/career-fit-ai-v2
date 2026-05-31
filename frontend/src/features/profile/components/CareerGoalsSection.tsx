export function CareerGoalsSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Career goals</h2>
      <p className="mt-1 text-sm text-slate-500">
        Describe what kind of career path you want to build.
      </p>

      <textarea
        rows={5}
        placeholder="I want to become a backend developer focused on scalable APIs, cloud deployment, and AI-powered products."
        className="mt-6 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </section>
  );
}
