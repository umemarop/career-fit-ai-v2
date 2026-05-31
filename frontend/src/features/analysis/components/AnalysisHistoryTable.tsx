type Recommendation = "APPLY" | "CONSIDER" | "NOT_RECOMMENDED";

type AnalysisHistoryItem = {
  id: string;
  jobTitle: string;
  companyName: string | null;
  location: string | null;
  fitScore: number;
  recommendation: Recommendation;
  createdAt: string;
};

type AnalysisHistoryTableProps = {
  analyses: AnalysisHistoryItem[];
};

const recommendationLabel = {
  APPLY: "Apply",
  CONSIDER: "Consider",
  NOT_RECOMMENDED: "Not recommended",
};

export function AnalysisHistoryTable({ analyses }: AnalysisHistoryTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Analysis History
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review your previous job fit analyses.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Fit Score</th>
              <th className="px-6 py-3 font-medium">Recommendation</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {analyses.map((analysis) => (
              <tr key={analysis.id}>
                <td className="px-6 py-4 font-medium text-slate-950">
                  {analysis.jobTitle}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {analysis.companyName ?? "-"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {analysis.location ?? "-"}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-950">
                  {analysis.fitScore}%
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {recommendationLabel[analysis.recommendation]}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {analysis.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
