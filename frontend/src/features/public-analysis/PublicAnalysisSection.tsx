"use client";

import { useEffect, useState } from "react";

import { aiUsageService } from "@/services/ai-usage.service";
import { analyzePublicJob } from "@/services/public-analysis.service";
import type { PublicAiUsage } from "@/types/ai-usage.types";
import type { GuestJobAnalysisResult } from "@/types/job-analysis.types";
import { normalizeApiError } from "@/utils/api-error";

import { PublicAnalysisForm } from "./components/PublicAnalysisForm";
import { PublicAnalysisResult } from "./components/PublicAnalysisResult";

export function PublicAnalysisSection() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<GuestJobAnalysisResult | null>(null);
  const [guestUsage, setGuestUsage] = useState<PublicAiUsage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshGuestUsage = async () => {
    try {
      const usage = await aiUsageService.getPublicAiUsage();
      setGuestUsage(usage);
    } catch {
      setGuestUsage(null);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const analysisResult = await analyzePublicJob({
        jobDescription,
      });

      setResult(analysisResult);
      await refreshGuestUsage();
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);

      await refreshGuestUsage();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshGuestUsage();
  }, []);

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <PublicAnalysisForm
        jobDescription={jobDescription}
        guestUsage={guestUsage}
        isLoading={isLoading}
        onJobDescriptionChange={setJobDescription}
        onSubmit={handleAnalyze}
      />

      <PublicAnalysisResult result={result} errorMessage={errorMessage} />
    </section>
  );
}
