import { Sparkles } from "lucide-react";

export function AnalysisHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          <Sparkles className="h-4 w-4" />
          AI Job Analysis
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Analyze your job fit
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Paste a job description and get a personalized fit analysis based on
          your profile, skills, and career preferences.
        </p>
      </div>
    </div>
  );
}
