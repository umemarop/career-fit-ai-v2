import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Wrench,
  ShieldAlert,
} from "lucide-react";

type AnalysisInsightsProps = {
  result: {
    matchedSkills: string[];
    missingSkills: string[];
    strengths: string[];
    risks: string[];
    resumeTips: string[];
    actionPlan: string[];
  };
};

const insightSections = [
  {
    key: "matchedSkills",
    title: "Matched Skills",
    icon: CheckCircle2,
  },
  {
    key: "missingSkills",
    title: "Missing Skills",
    icon: Wrench,
  },
  {
    key: "strengths",
    title: "Strengths",
    icon: Target,
  },
  {
    key: "risks",
    title: "Risks",
    icon: ShieldAlert,
  },
  {
    key: "resumeTips",
    title: "Resume Tips",
    icon: Lightbulb,
  },
  {
    key: "actionPlan",
    title: "Action Plan",
    icon: AlertTriangle,
  },
] as const;

export function AnalysisInsights({ result }: AnalysisInsightsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {insightSections.map((section) => {
        const Icon = section.icon;
        const items = result[section.key];

        return (
          <div
            key={section.key}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-950">{section.title}</h3>
            </div>

            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
