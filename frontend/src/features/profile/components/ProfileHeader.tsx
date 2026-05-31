export function ProfileHeader() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-indigo-600">Profile</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Manage your career profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Keep your profile up to date so CareerFit AI can provide better job
          analysis, recommendations, and application insights.
        </p>
      </div>
    </section>
  );
}
