import type { AuthUser } from "@/types/auth.types";
import { useAiUsage } from "@/contexts/ai-usage-context";

type DashboardWelcomeProps = {
  user: AuthUser | null;
};

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  const { usage } = useAiUsage();
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-indigo-600">Welcome back</p>

      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
        Build a smarter job search workflow.
      </h2>

      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        {user?.email
          ? `${user.email}, manage your profile, resume, job analyses, and applications from one place.`
          : "Manage your profile, upload your resume, analyze job descriptions, and track your applications from one place."}
      </p>
      {usage ? (
        <div className="mt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            ✨ {usage.jobAnalysis.remaining} analyses remaining ·{" "}
            {usage.resumeAutofill.remaining} autofills remaining
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Daily limits reset every day: {usage.jobAnalysis.limit} job analyses
            and {usage.resumeAutofill.limit} resume autofills.
          </p>
        </div>
      ) : null}
    </section>
  );
}
