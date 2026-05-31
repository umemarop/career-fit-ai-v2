type FitScoreCardProps = {
  score: number;
};

export function FitScoreCard({ score }: FitScoreCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Fit Score</p>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-5xl font-bold tracking-tight text-slate-950">
          {score}
        </span>
        <span className="mb-1 text-xl font-semibold text-slate-500">%</span>
      </div>

      <div className="mt-5 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-indigo-600"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        This score is calculated by comparing your profile with the job
        requirements.
      </p>
    </section>
  );
}
