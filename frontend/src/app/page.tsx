import Link from "next/link";
import { BriefcaseBusiness, FileText, Sparkles, Kanban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicAnalysisSection } from "@/features/public-analysis/PublicAnalysisSection";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Career Profile",
    description:
      "Build a structured profile with your skills, experience, target roles, and work eligibility.",
  },
  {
    icon: FileText,
    title: "Resume Management",
    description:
      "Upload, replace, and organize resumes as the foundation for smarter job analysis.",
  },
  {
    icon: Sparkles,
    title: "AI Job Analysis",
    description:
      "Compare job descriptions against your profile and resume to understand your match and gaps.",
  },
  {
    icon: Kanban,
    title: "Application Tracking",
    description:
      "Track job applications, statuses, notes, and progress in one clean workspace.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          CareerFit AI
        </Link>

        <nav className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="text-slate-700 hover:bg-slate-100"
          >
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">
        <div className="mb-6 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
          AI-powered job application assistant
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Understand your fit before you apply.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          CareerFit AI helps you build your profile, manage resumes, analyze job
          descriptions, and track applications in one professional workspace.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-6">
            <Link href="/register">Start for free</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-slate-300 px-8 text-slate-700 hover:bg-slate-100"
          >
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </section>

      <PublicAnalysisSection />

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
