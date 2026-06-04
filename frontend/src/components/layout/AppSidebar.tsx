import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Career Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Resume",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "Applications",
    href: "/applications",
    icon: Briefcase,
  },
  {
    label: "Analysis",
    href: "/analysis",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white px-4 py-5 lg:flex lg:flex-col">
      <div className="mb-8">
        <Link href="/dashboard" className="block">
          <p className="text-lg font-semibold text-slate-950">CareerFit AI</p>
          <p className="mt-1 text-sm text-slate-500">Job search assistant</p>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
        <p className="font-medium text-slate-700">CareerFit AI v2</p>
        <p className="mt-1">Portfolio SaaS app</p>
      </div>
    </aside>
  );
}
