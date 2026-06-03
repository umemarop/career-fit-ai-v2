import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  JobAnalysisListQuery,
  Recommendation,
} from "@/types/job-analysis.types";

type AnalysisFiltersProps = {
  keyword: string;
  recommendation: Recommendation | "ALL";
  sort: NonNullable<JobAnalysisListQuery["sort"]>;
  onKeywordChange: (value: string) => void;
  onRecommendationChange: (value: Recommendation | "ALL") => void;
  onSortChange: (value: NonNullable<JobAnalysisListQuery["sort"]>) => void;
  onReset: () => void;
};

export function AnalysisFilters({
  keyword,
  recommendation,
  sort,
  onKeywordChange,
  onRecommendationChange,
  onSortChange,
  onReset,
}: AnalysisFiltersProps) {
  return (
    <div className="grid gap-3 border-b border-slate-200 p-6 md:grid-cols-[1fr_180px_180px_auto]">
      <Input
        value={keyword}
        placeholder="Search by role, company, location..."
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <select
        value={recommendation}
        onChange={(event) =>
          onRecommendationChange(event.target.value as Recommendation | "ALL")
        }
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="ALL">All recommendations</option>
        <option value="APPLY">Apply</option>
        <option value="CONSIDER">Consider</option>
        <option value="NOT_RECOMMENDED">Not recommended</option>
      </select>

      <select
        value={sort}
        onChange={(event) =>
          onSortChange(
            event.target.value as NonNullable<JobAnalysisListQuery["sort"]>,
          )
        }
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="latest">Latest</option>
        <option value="fitScore_desc">Highest fit score</option>
        <option value="fitScore_asc">Lowest fit score</option>
      </select>

      <Button type="button" variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
