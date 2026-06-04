import { useCallback, useEffect, useState } from "react";
import { BarChart3, Briefcase, FileText, User } from "lucide-react";

import { useAuth } from "@/features/auth/useAuth";
import { dashboardService } from "@/services/dashboard.service";
import { applicationService } from "@/services/application.service";
import { jobAnalysisService } from "@/services/job-analysis.service";
import type { ApplicationListItem } from "@/types/application.types";
import type { JobAnalysisListItem } from "@/types/job-analysis.types";
import { normalizeApiError } from "@/utils/api-error";

const RECENT_LIMIT = 5;

export function useDashboardPage() {
  const { user } = useAuth();

  const [verificationMessage, setVerificationMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const [recentAnalyses, setRecentAnalyses] = useState<JobAnalysisListItem[]>(
    [],
  );
  const [recentApplications, setRecentApplications] = useState<
    ApplicationListItem[]
  >([]);

  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [interviewingCount, setInterviewingCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleResendVerification = async () => {
    try {
      setIsResendingVerification(true);
      setVerificationMessage(null);

      const response = await dashboardService.resendVerificationEmail();

      setVerificationMessage({
        type: "success",
        message: response.message,
      });
    } catch (error) {
      setVerificationMessage({
        type: "error",
        message: normalizeApiError(error).message,
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [analysesResult, applicationsResult, interviewingResult] =
        await Promise.all([
          jobAnalysisService.getMyAnalyses({
            page: 1,
            limit: RECENT_LIMIT,
            sort: "latest",
          }),
          applicationService.getApplications({
            page: 1,
            limit: RECENT_LIMIT,
            sort: "latest",
          }),
          applicationService.getApplications({
            page: 1,
            limit: 1,
            status: "INTERVIEWING",
          }),
        ]);

      setRecentAnalyses(analysesResult.data);
      setTotalAnalyses(analysesResult.meta.total);

      setRecentApplications(applicationsResult.data);
      setTotalApplications(applicationsResult.meta.total);

      setInterviewingCount(interviewingResult.meta.total);
    } catch (error) {
      setErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const recentAverageFitScore =
    recentAnalyses.length > 0
      ? Math.round(
          recentAnalyses.reduce(
            (total, analysis) => total + analysis.fitScore,
            0,
          ) / recentAnalyses.length,
        )
      : null;

  const stats = [
    {
      label: "Applications",
      value: String(totalApplications),
      description: "Tracked job applications",
      icon: Briefcase,
    },
    {
      label: "Analyses",
      value: String(totalAnalyses),
      description: "Saved job analyses",
      icon: BarChart3,
    },
    {
      label: "Recent Avg. Score",
      value: recentAverageFitScore ? `${recentAverageFitScore}%` : "-",
      description: "Average score from recent analyses",
      icon: FileText,
    },
    {
      label: "Interviewing",
      value: String(interviewingCount),
      description: "Applications currently interviewing",
      icon: Briefcase,
    },
  ];

  const quickActions = [
    {
      title: "Complete your profile",
      description: "Add your skills, experience level, and job preferences.",
      href: "/profile",
      icon: User,
    },
    {
      title: "Upload your resume",
      description:
        "Use your resume to autofill your profile and improve analysis.",
      href: "/resume",
      icon: FileText,
    },
    {
      title: "Analyze a job",
      description: "Paste a job description and get your match score.",
      href: "/analysis",
      icon: BarChart3,
    },
    {
      title: "Manage applications",
      description: "Track statuses, notes, next steps, and interviews.",
      href: "/applications",
      icon: Briefcase,
    },
  ];

  return {
    user,
    verificationMessage,
    isResendingVerification,
    handleResendVerification,
    stats,
    quickActions,
    recentAnalyses,
    recentApplications,
    isLoading,
    errorMessage,
    refetchDashboard: fetchDashboard,
  };
}
