import { AnalysisForm } from "@/features/analysis/components/AnalysisForm";
import { AnalysisHeader } from "@/features/analysis/components/AnalysisHeader";
import { AnalysisHistoryTable } from "@/features/analysis/components/AnalysisHistoryTable";
import { AnalysisInsights } from "@/features/analysis/components/AnalysisInsights";
import { AnalysisResultCard } from "@/features/analysis/components/AnalysisResultCard";
import { FitScoreCard } from "@/features/analysis/components/FitScoreCard";
import { RecommendationCard } from "@/features/analysis/components/RecommendationCard";

const mockAnalysisResult = {
  jobTitle: "Junior Backend Developer",
  companyName: "Startup Labs",
  location: "Brisbane, Australia",
  fitScore: 82,
  recommendation: "APPLY" as const,
  result: {
    matchedSkills: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "REST API design",
      "Authentication",
    ],
    missingSkills: ["AWS deployment", "CI/CD pipeline experience"],
    strengths: [
      "Your backend stack matches most of the core requirements.",
      "Your authentication and API experience are highly relevant.",
      "Your PostgreSQL and Prisma experience fits the role well.",
    ],
    risks: [
      "The job expects some cloud deployment experience.",
      "You may need stronger examples of production monitoring or CI/CD.",
    ],
    resumeTips: [
      "Highlight your refresh token rotation and email verification implementation.",
      "Mention Docker, Prisma, PostgreSQL, Swagger, and Jest clearly.",
      "Add a short project impact summary near the top of your resume.",
    ],
    actionPlan: [
      "Prepare one story explaining your authentication architecture.",
      "Review basic AWS deployment concepts before applying.",
      "Add screenshots or Swagger docs link to your portfolio README.",
    ],
  },
};

const mockHistory = [
  {
    id: "1",
    jobTitle: "Junior Backend Developer",
    companyName: "Startup Labs",
    location: "Brisbane",
    fitScore: 82,
    recommendation: "APPLY" as const,
    createdAt: "May 31, 2026",
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    companyName: "CareerTech",
    location: "Sydney",
    fitScore: 74,
    recommendation: "CONSIDER" as const,
    createdAt: "May 29, 2026",
  },
  {
    id: "3",
    jobTitle: "Senior Backend Engineer",
    companyName: "ScaleUp AI",
    location: "Melbourne",
    fitScore: 48,
    recommendation: "NOT_RECOMMENDED" as const,
    createdAt: "May 27, 2026",
  },
];

export default function AnalysisPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AnalysisHeader />

      <AnalysisForm />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FitScoreCard score={mockAnalysisResult.fitScore} />
        </div>

        <div className="lg:col-span-1">
          <RecommendationCard
            recommendation={mockAnalysisResult.recommendation}
          />
        </div>

        <div className="lg:col-span-1">
          <AnalysisResultCard
            jobTitle={mockAnalysisResult.jobTitle}
            companyName={mockAnalysisResult.companyName}
            location={mockAnalysisResult.location}
          />
        </div>
      </div>

      <AnalysisInsights result={mockAnalysisResult.result} />

      <AnalysisHistoryTable analyses={mockHistory} />
    </div>
  );
}
