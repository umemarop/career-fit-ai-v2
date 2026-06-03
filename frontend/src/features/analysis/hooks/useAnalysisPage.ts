"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

type AnalysisResult = ApplicationSourceAnalysis & {
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
};

const HISTORY_LIMIT = 10;

export function useAnalysisPage() {
  const router = useRouter();
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );

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

  const scrollToResultSection = () => {
    requestAnimationFrame(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

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
      scrollToResultSection();
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
      scrollToResultSection();
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

  return {
    resultSectionRef,

    jobDescription,
    analysisResult,
    history,
    historyMeta,
    keyword,
    recommendation,
    sort,
    selectedAnalysisId,

    isAnalyzing,
    isHistoryLoading,
    isSelectingAnalysis,

    isCreateApplicationOpen,
    applicationInitialData,
    isCreatingApplication,
    applicationErrorMessage,

    isGoToApplicationOpen,

    setJobDescription,
    handleAnalyze,
    openCreateApplicationModal,
    closeCreateApplicationModal,
    handleCreateApplication,
    handleGoToCreatedApplication,
    handleStayOnAnalysis,
    handleSelectAnalysis,
    handleChangeHistoryPage,
    handleKeywordChange,
    handleRecommendationChange,
    handleSortChange,
    handleResetFilters,
  };
}
