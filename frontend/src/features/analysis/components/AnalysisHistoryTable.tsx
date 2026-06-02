import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/job-analysis.types";
import { formatDate } from "@/utils/format";

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
  meta: PaginationMeta | null;
  selectedAnalysisId: string | null;
  isSelecting: boolean;
  onSelectAnalysis: (id: string) => void;
  onChangePage: (page: number) => void;
};

const recommendationConfig = {
  APPLY: {
    label: "Apply",
    className: "border-green-100 bg-green-50 text-green-700",
  },
  CONSIDER: {
    label: "Consider",
    className: "border-amber-100 bg-amber-50 text-amber-700",
  },
  NOT_RECOMMENDED: {
    label: "Not recommended",
    className: "border-red-100 bg-red-50 text-red-700",
  },
};

export function AnalysisHistoryTable({
  analyses,
  meta,
  selectedAnalysisId,
  isSelecting,
  onSelectAnalysis,
  onChangePage,
}: AnalysisHistoryTableProps) {
  const hasAnalyses = analyses.length > 0;
  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? analyses.length;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Analysis History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review your previous job fit analyses.
          </p>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          {total} {total === 1 ? "analysis" : "analyses"} saved
        </div>
      </div>

      {!hasAnalyses ? (
        <div className="p-6 text-sm text-slate-500">
          No analysis history yet.
        </div>
      ) : (
        <>
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
                {analyses.map((analysis) => {
                  const isSelected = analysis.id === selectedAnalysisId;
                  const recommendation =
                    recommendationConfig[analysis.recommendation];

                  return (
                    <tr
                      key={analysis.id}
                      className={
                        isSelected
                          ? "border-l-4 border-indigo-600 bg-indigo-50"
                          : "border-l-4 border-transparent transition hover:bg-slate-50"
                      }
                    >
                      <td className="px-6 py-4 font-medium text-slate-950">
                        <button
                          type="button"
                          className="text-left font-medium text-slate-950 hover:text-indigo-700 disabled:cursor-not-allowed"
                          disabled={isSelecting}
                          onClick={() => onSelectAnalysis(analysis.id)}
                        >
                          {analysis.jobTitle}
                        </button>
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

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${recommendation.className}`}
                        >
                          {recommendation.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(analysis.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-5">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages} · {total} total
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canGoPrevious}
                onClick={() => onChangePage(currentPage - 1)}
              >
                Previous
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canGoNext}
                onClick={() => onChangePage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
