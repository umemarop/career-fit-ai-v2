import Link from "next/link";
import { AlertTriangle, CheckCircle2, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GuestJobAnalysisResult } from "@/types/job-analysis.types";

type PublicAnalysisResultProps = {
  result: GuestJobAnalysisResult | null;
  errorMessage?: string | null;
};

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No items found.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No items found.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PublicAnalysisResult({
  result,
  errorMessage,
}: PublicAnalysisResultProps) {
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600" />
          <div>
            <h3 className="font-semibold text-rose-900">Analysis failed</h3>
            <p className="mt-2 text-sm leading-6 text-rose-700">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-[380px] flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Sparkles className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
          Your analysis will appear here
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Paste a job description to preview how CareerFit AI extracts role
          details, required skills, responsibilities, preparation tips, and key
          considerations.
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            Required Skills
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            Preferred Skills
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            Key Responsibilities
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            Preparation Tips
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Things to Consider
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Guest analysis gives you a quick role breakdown.{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Create your profile →
          </Link>{" "}
          to unlock personalized fit scores, recommendations, and saved analysis
          history.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Quick Analysis Result
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {result.jobTitle}
          </h3>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span>{result.companyName ?? "Company not specified"}</span>

          <span className="hidden text-slate-300 sm:inline">•</span>

          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-slate-400" />
            {result.location ?? "Location not specified"}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-6">
        <section>
          <h4 className="text-sm font-semibold text-slate-950">Summary</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {result.summary}
          </p>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-950">
            Required Skills
          </h4>
          <div className="mt-3">
            <TagList items={result.requiredSkills} />
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-950">
            Preferred Skills
          </h4>
          <div className="mt-3">
            <TagList items={result.preferredSkills} />
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-950">
            Key Responsibilities
          </h4>
          <div className="mt-3">
            <BulletList items={result.responsibilities} />
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-950">
            Preparation Tips
          </h4>
          <div className="mt-3">
            <BulletList items={result.preparationTips} />
          </div>
        </section>

        {result.warnings.length > 0 ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              Things to Consider
            </h4>

            <ul className="mt-3 space-y-2">
              {result.warnings.map((warning) => (
                <li key={warning} className="text-sm leading-6 text-amber-800">
                  • {warning}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <h4 className="text-sm font-semibold text-indigo-950">
            Want a personalized fit score?
          </h4>

          <p className="mt-2 text-sm leading-6 text-indigo-800">
            Create your profile to unlock fit scores, recommendations, resume
            tips, and saved analysis history.
          </p>

          <Button asChild className="mt-4">
            <Link href="/register">Create free account</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
