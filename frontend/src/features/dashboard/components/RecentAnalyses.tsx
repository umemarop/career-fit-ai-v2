import Link from "next/link";

import type { JobAnalysisListItem } from "@/types/job-analysis.types";

type RecentAnalysesProps = {
  analyses: JobAnalysisListItem[];
};

const recommendationLabelMap: Record<
  JobAnalysisListItem["recommendation"],
  string
> = {
  APPLY: "Apply",
  CONSIDER: "Consider",
  NOT_RECOMMENDED: "Not Recommended",
};

const recommendationClassNameMap: Record<
  JobAnalysisListItem["recommendation"],
  string
> = {
  APPLY: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CONSIDER: "border-amber-200 bg-amber-50 text-amber-700",
  NOT_RECOMMENDED: "border-red-200 bg-red-50 text-red-700",
};

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  const hasAnalyses = analyses.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-950">
          Recent Analyses
        </h3>

        <Link
          href="/analysis"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          View all
        </Link>
      </div>

      {hasAnalyses ? (
        <div className="mt-4 divide-y divide-slate-100">
          {analyses.map((analysis) => (
            <Link
              key={analysis.id}
              href={`/analysis?selected=${analysis.id}`}
              className="block py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-950">
                    {analysis.jobTitle}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {analysis.companyName || "Company not provided"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-950">
                    {analysis.fitScore}%
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                      recommendationClassNameMap[analysis.recommendation]
                    }`}
                  >
                    {recommendationLabelMap[analysis.recommendation]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-700">No analyses yet</p>

          <p className="mt-1 text-sm text-slate-500">
            Analyze a job description to see your fit score and recommendation.
          </p>

          <Link
            href="/analysis"
            className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Analyze a job
          </Link>
        </div>
      )}
    </div>
  );
}
