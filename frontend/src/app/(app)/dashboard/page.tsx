import Link from "next/link";
import { BarChart3, Briefcase, FileText, User } from "lucide-react";

const stats = [
  {
    label: "Applications",
    value: "0",
    description: "Tracked job applications",
    icon: Briefcase,
  },
  {
    label: "Analyses",
    value: "0",
    description: "Saved job analyses",
    icon: BarChart3,
  },
  {
    label: "Avg. Match Score",
    value: "-",
    description: "Analyze jobs to see your fit",
    icon: FileText,
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
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-indigo-600">
          Welcome to CareerFit AI
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Build a smarter job search workflow.
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Manage your profile, upload your resume, analyze job descriptions, and
          track your applications from one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-semibold text-slate-950">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-950">
            Quick Actions
          </h3>

          <div className="mt-4 space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-950">
                      {action.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-950">
            Recent Activity
          </h3>

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              No recent activity yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your analyses and applications will appear here once you start
              using the app.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
