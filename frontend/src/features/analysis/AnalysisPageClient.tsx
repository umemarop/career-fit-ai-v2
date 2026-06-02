"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AnalysisForm } from "@/features/analysis/components/AnalysisForm";
import { AnalysisHeader } from "@/features/analysis/components/AnalysisHeader";
import { AnalysisHistoryTable } from "@/features/analysis/components/AnalysisHistoryTable";
import { AnalysisInsights } from "@/features/analysis/components/AnalysisInsights";
import { AnalysisResultCard } from "@/features/analysis/components/AnalysisResultCard";
import { FitScoreCard } from "@/features/analysis/components/FitScoreCard";
import { RecommendationCard } from "@/features/analysis/components/RecommendationCard";
import { jobAnalysisService } from "@/services/job-analysis.service";
import type {
  JobAnalysisDetail,
  JobAnalysisListItem,
  PaginationMeta,
} from "@/types/job-analysis.types";
import { normalizeApiError } from "@/utils/api-error";

const HISTORY_LIMIT = 10;

export function AnalysisPageClient() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] =
    useState<JobAnalysisDetail | null>(null);

  const [history, setHistory] = useState<JobAnalysisListItem[]>([]);
  const [historyMeta, setHistoryMeta] = useState<PaginationMeta | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null,
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSelectingAnalysis, setIsSelectingAnalysis] = useState(false);

  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  const loadHistory = async (page = historyPage) => {
    try {
      setIsHistoryLoading(true);

      const result = await jobAnalysisService.getMyAnalyses({
        page,
        limit: HISTORY_LIMIT,
        sort: "latest",
      });

      setHistory(result.data);
      setHistoryMeta(result.meta);
      setHistoryPage(result.meta.page);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      toast.error(normalizedError.message);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);

      const result = await jobAnalysisService.create({
        jobDescription,
      });

      setAnalysisResult(result);
      setSelectedAnalysisId(result.id);
      setJobDescription("");

      await loadHistory(1);

      toast.success("Analysis completed.");

      requestAnimationFrame(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      toast.error(normalizedError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAnalysis = async (id: string) => {
    try {
      setSelectedAnalysisId(id);
      setIsSelectingAnalysis(true);

      const result = await jobAnalysisService.getById(id);

      setAnalysisResult(result);

      requestAnimationFrame(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      toast.error(normalizedError.message);
    } finally {
      setIsSelectingAnalysis(false);
    }
  };

  const handleChangeHistoryPage = async (page: number) => {
    await loadHistory(page);
  };

  useEffect(() => {
    loadHistory(1);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AnalysisHeader />

      <AnalysisForm
        value={jobDescription}
        isLoading={isAnalyzing}
        onChange={setJobDescription}
        onSubmit={handleAnalyze}
      />

      <div ref={resultSectionRef} className="scroll-mt-6">
        {isSelectingAnalysis && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading selected analysis...
          </section>
        )}

        {!analysisResult && !isSelectingAnalysis && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-950">
              No analysis yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Paste a job description above to generate your personalized fit
              analysis.
            </p>
          </section>
        )}

        {analysisResult && !isSelectingAnalysis && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <FitScoreCard score={analysisResult.fitScore} />

              <RecommendationCard
                recommendation={analysisResult.recommendation}
              />

              <AnalysisResultCard
                jobTitle={analysisResult.jobTitle}
                companyName={analysisResult.companyName}
                location={analysisResult.location}
              />
            </div>

            <AnalysisInsights result={analysisResult.result} />
          </div>
        )}
      </div>

      {isHistoryLoading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading analysis history...
        </section>
      ) : (
        <AnalysisHistoryTable
          analyses={history}
          meta={historyMeta}
          selectedAnalysisId={selectedAnalysisId}
          isSelecting={isSelectingAnalysis}
          onSelectAnalysis={handleSelectAnalysis}
          onChangePage={handleChangeHistoryPage}
        />
      )}
    </div>
  );
}
