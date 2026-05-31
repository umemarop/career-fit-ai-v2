"use client";

import { useState } from "react";

import { analyzePublicJob } from "@/services/public-analysis.service";
import type { GuestJobAnalysisResult } from "@/types/job-analysis.types";
import { normalizeApiError } from "@/utils/api-error";

import { PublicAnalysisForm } from "./PublicAnalysisForm";
import { PublicAnalysisResult } from "./PublicAnalysisResult";

export function PublicAnalysisSection() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<GuestJobAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const analysisResult = await analyzePublicJob({
        jobDescription,
      });

      setResult(analysisResult);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <PublicAnalysisForm
        jobDescription={jobDescription}
        isLoading={isLoading}
        onJobDescriptionChange={setJobDescription}
        onSubmit={handleAnalyze}
      />

      <PublicAnalysisResult result={result} errorMessage={errorMessage} />
    </section>
  );
}
