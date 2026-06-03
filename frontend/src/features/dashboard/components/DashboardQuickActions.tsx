import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type DashboardQuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type DashboardQuickActionsProps = {
  actions: DashboardQuickAction[];
};

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Jump back into your job search workflow.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-indigo-100 group-hover:text-indigo-700">
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-950">
                {action.title}
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
