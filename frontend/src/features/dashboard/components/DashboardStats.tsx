import type { LucideIcon } from "lucide-react";

type DashboardStat = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

type DashboardStatsProps = {
  stats: DashboardStat[];
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>

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
  );
}
