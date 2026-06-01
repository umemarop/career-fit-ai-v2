import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader />

            <main className="flex-1 px-6 py-6">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
