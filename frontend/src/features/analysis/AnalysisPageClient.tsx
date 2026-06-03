"use client";

import { ApplicationFormModal } from "@/features/applications/components/ApplicationFormModal";
import { AnalysisForm } from "@/features/analysis/components/AnalysisForm";
import { AnalysisHeader } from "@/features/analysis/components/AnalysisHeader";
import { AnalysisHistoryTable } from "@/features/analysis/components/AnalysisHistoryTable";
import { AnalysisInsights } from "@/features/analysis/components/AnalysisInsights";
import { AnalysisResultCard } from "@/features/analysis/components/AnalysisResultCard";
import { FitScoreCard } from "@/features/analysis/components/FitScoreCard";
import { GoToApplicationModal } from "@/features/analysis/components/GoToApplicationModal";
import { RecommendationCard } from "@/features/analysis/components/RecommendationCard";
import { useAnalysisPage } from "@/features/analysis/hooks/useAnalysisPage";

export function AnalysisPageClient() {
  const {
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
  } = useAnalysisPage();

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
        {isSelectingAnalysis ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading selected analysis...
          </section>
        ) : null}

        {!analysisResult && !isSelectingAnalysis ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-950">
              No analysis yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Paste a job description above to generate your personalized fit
              analysis.
            </p>
          </section>
        ) : null}

        {analysisResult && !isSelectingAnalysis ? (
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
        ) : null}
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
