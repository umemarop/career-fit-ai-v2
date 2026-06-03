import type { AuthUser } from "@/types/auth.types";

type DashboardWelcomeProps = {
  user: AuthUser | null;
};

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
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
    </section>
  );
}
