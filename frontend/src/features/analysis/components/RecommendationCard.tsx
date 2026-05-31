import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Recommendation = "APPLY" | "CONSIDER" | "NOT_RECOMMENDED";

type RecommendationCardProps = {
  recommendation: Recommendation;
};

const recommendationConfig = {
  APPLY: {
    label: "Apply",
    description: "This role looks like a strong match for your profile.",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-100",
  },
  CONSIDER: {
    label: "Consider",
    description: "This role may be worth applying for with some preparation.",
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  NOT_RECOMMENDED: {
    label: "Not recommended",
    description: "This role may not be the best match right now.",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-100",
  },
};

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const config = recommendationConfig[recommendation];
  const Icon = config.icon;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Recommendation</p>

      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${config.className}`}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {config.description}
      </p>
    </section>
  );
}
