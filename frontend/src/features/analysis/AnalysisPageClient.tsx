"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ApplicationFormModal } from "@/features/applications/components/ApplicationFormModal";
import { AnalysisForm } from "@/features/analysis/components/AnalysisForm";
import { AnalysisHeader } from "@/features/analysis/components/AnalysisHeader";
import { AnalysisHistoryTable } from "@/features/analysis/components/AnalysisHistoryTable";
import { AnalysisInsights } from "@/features/analysis/components/AnalysisInsights";
import { AnalysisResultCard } from "@/features/analysis/components/AnalysisResultCard";
import { FitScoreCard } from "@/features/analysis/components/FitScoreCard";
import { GoToApplicationModal } from "@/features/analysis/components/GoToApplicationModal";
import { RecommendationCard } from "@/features/analysis/components/RecommendationCard";
import { applicationService } from "@/services/application.service";
import { jobAnalysisService } from "@/services/job-analysis.service";
import type {
  ApplicationFormInitialData,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/types/application.types";
import type {
  JobAnalysisListItem,
  JobAnalysisListQuery,
  PaginationMeta,
  Recommendation,
} from "@/types/job-analysis.types";
import { normalizeApiError } from "@/utils/api-error";

type ApplicationSourceAnalysis = Pick<
  JobAnalysisListItem,
  "id" | "jobTitle" | "companyName" | "location"
>;

const HISTORY_LIMIT = 10;

export function AnalysisPageClient() {
  const router = useRouter();
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<
    | (ApplicationSourceAnalysis & {
        jobDescription: string;
        fitScore: number;
        recommendation: Recommendation;
        result: {
          matchedSkills: string[];
          missingSkills: string[];
          strengths: string[];
          risks: string[];
          resumeTips: string[];
          actionPlan: string[];
        };
        createdAt: string;
        updatedAt: string;
      })
    | null
  >(null);

  const [history, setHistory] = useState<JobAnalysisListItem[]>([]);
  const [historyMeta, setHistoryMeta] = useState<PaginationMeta | null>(null);
  const [historyPage, setHistoryPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | "ALL">(
    "ALL",
  );
  const [sort, setSort] =
    useState<NonNullable<JobAnalysisListQuery["sort"]>>("latest");

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null,
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSelectingAnalysis, setIsSelectingAnalysis] = useState(false);

  const [isCreateApplicationOpen, setIsCreateApplicationOpen] = useState(false);
  const [applicationInitialData, setApplicationInitialData] =
    useState<ApplicationFormInitialData | null>(null);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);
  const [applicationErrorMessage, setApplicationErrorMessage] = useState<
    string | null
  >(null);

  const [createdApplicationId, setCreatedApplicationId] = useState<
    string | null
  >(null);
  const [isGoToApplicationOpen, setIsGoToApplicationOpen] = useState(false);

  const loadHistory = async (page = historyPage) => {
    try {
      setIsHistoryLoading(true);

      const trimmedKeyword = keyword.trim();

      const result = await jobAnalysisService.getMyAnalyses({
        page,
        limit: HISTORY_LIMIT,
        sort,
        keyword: trimmedKeyword || undefined,
        recommendation: recommendation === "ALL" ? undefined : recommendation,
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

  const buildApplicationInitialData = (
    analysis: ApplicationSourceAnalysis,
  ): ApplicationFormInitialData => ({
    jobAnalysisId: analysis.id,
    jobTitle: analysis.jobTitle,
    companyName: analysis.companyName,
    location: analysis.location,
    status: "SAVED",
  });

  const openCreateApplicationModal = (analysis: ApplicationSourceAnalysis) => {
    setApplicationInitialData(buildApplicationInitialData(analysis));
    setApplicationErrorMessage(null);
    setIsCreateApplicationOpen(true);
  };

  const closeCreateApplicationModal = () => {
    if (isCreatingApplication) return;

    setIsCreateApplicationOpen(false);
    setApplicationInitialData(null);
    setApplicationErrorMessage(null);
  };

  const handleCreateApplication = async (
    input: CreateApplicationInput | UpdateApplicationInput,
  ) => {
    try {
      setIsCreatingApplication(true);
      setApplicationErrorMessage(null);

      const createdApplication = await applicationService.createApplication(
        input as CreateApplicationInput,
      );

      setCreatedApplicationId(createdApplication.id);
      setIsCreateApplicationOpen(false);
      setApplicationInitialData(null);
      setIsGoToApplicationOpen(true);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setApplicationErrorMessage(normalizedError.message);
    } finally {
      setIsCreatingApplication(false);
    }
  };

  const handleGoToCreatedApplication = () => {
    if (!createdApplicationId) return;

    router.push(`/applications?selected=${createdApplicationId}`);
  };

  const handleStayOnAnalysis = () => {
    setIsGoToApplicationOpen(false);
    setCreatedApplicationId(null);
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

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setHistoryPage(1);
  };

  const handleRecommendationChange = (value: Recommendation | "ALL") => {
    setRecommendation(value);
    setHistoryPage(1);
  };

  const handleSortChange = (
    value: NonNullable<JobAnalysisListQuery["sort"]>,
  ) => {
    setSort(value);
    setHistoryPage(1);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setRecommendation("ALL");
    setSort("latest");
    setHistoryPage(1);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadHistory(1);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [keyword, recommendation, sort]);

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
                onCreateApplication={() =>
                  openCreateApplicationModal({
                    id: analysisResult.id,
                    jobTitle: analysisResult.jobTitle,
                    companyName: analysisResult.companyName,
                    location: analysisResult.location,
                  })
                }
              />
            </div>

            <AnalysisInsights result={analysisResult.result} />
          </div>
        )}
      </div>

      <AnalysisHistoryTable
        analyses={history}
        meta={historyMeta}
        selectedAnalysisId={selectedAnalysisId}
        isSelecting={isSelectingAnalysis}
        isLoading={isHistoryLoading}
        keyword={keyword}
        recommendation={recommendation}
        sort={sort}
        onKeywordChange={handleKeywordChange}
        onRecommendationChange={handleRecommendationChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onSelectAnalysis={handleSelectAnalysis}
        onCreateApplication={openCreateApplicationModal}
        onChangePage={handleChangeHistoryPage}
      />

      <ApplicationFormModal
        isOpen={isCreateApplicationOpen}
        mode="create"
        initialData={applicationInitialData}
        isSubmitting={isCreatingApplication}
        errorMessage={applicationErrorMessage}
        onClose={closeCreateApplicationModal}
        onSubmit={handleCreateApplication}
      />

      <GoToApplicationModal
        isOpen={isGoToApplicationOpen}
        onConfirm={handleGoToCreatedApplication}
        onCancel={handleStayOnAnalysis}
      />
    </div>
  );
}
