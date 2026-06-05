import {
  BarChart3,
  FileText,
  ShieldCheck,
  UserCheck,
  Users,
  Briefcase,
} from "lucide-react";

import type { AdminStats } from "@/types/admin.types";

type AdminStatsCardsProps = {
  stats: AdminStats | null;
};

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      label: "Total Users",
      value: stats?.users.total ?? 0,
      icon: Users,
    },
    {
      label: "Verified Users",
      value: stats?.users.verified ?? 0,
      icon: UserCheck,
    },
    {
      label: "Admin Users",
      value: stats?.users.admins ?? 0,
      icon: ShieldCheck,
    },
    {
      label: "Profiles",
      value: stats?.profiles.total ?? 0,
      icon: FileText,
    },
    {
      label: "Applications",
      value: stats?.applications.total ?? 0,
      icon: Briefcase,
    },
    {
      label: "Job Analyses",
      value: stats?.jobAnalyses.total ?? 0,
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>

              <Icon className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-950">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
