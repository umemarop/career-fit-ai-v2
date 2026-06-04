"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/useAuth";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/profile")) return "Career Profile";
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

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pageTitle = getPageTitle(pathname);
  const initial = user?.email?.[0]?.toUpperCase() ?? "U";
  const isVerified = Boolean(user?.isEmailVerified);

  const handleGoToSettings = () => {
    setIsMenuOpen(false);
    router.push("/settings");
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    router.replace("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-950">{pageTitle}</h1>
      </div>

      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            {user?.email ?? "User"}
          </p>

          <div className="mt-0.5 flex items-center justify-end gap-2 text-xs">
            <span className="text-slate-500">{user?.role ?? "USER"}</span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                isVerified
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {isVerified ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="flex h-10 items-center gap-1 rounded-full bg-indigo-600 pl-3 pr-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          aria-label="Open user menu"
          aria-expanded={isMenuOpen}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full">
            {initial}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isMenuOpen ? (
          <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="truncate text-sm font-medium text-slate-900">
                {user?.email ?? "User"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {user?.role ?? "USER"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoToSettings}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-indigo-50"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
