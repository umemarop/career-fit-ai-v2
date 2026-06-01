"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/resume")) return "Resume";
  if (pathname.startsWith("/applications")) return "Applications";
  if (pathname.startsWith("/analysis")) return "Analysis";
  if (pathname.startsWith("/settings")) return "Settings";

  return "Dashboard";
};

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const pageTitle = getPageTitle(pathname);
  const initial = user?.email?.[0]?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-950">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            {user?.email ?? "User"}
          </p>
          <p className="text-xs text-slate-500">{user?.role ?? "USER"}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          {initial}
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
