
import type { ReactNode } from "react";
import DashboardNavigation from "./components/dashboard-navigation";
import LogoutButton from "@/components/logout-button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar and mobile navigation */}
        <DashboardNavigation />

        {/* Main Workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Navigation */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#1E293B] bg-[#050914] px-5 pl-16 sm:px-8 sm:pl-8">
            <div>
              <p className="text-sm font-semibold text-white">
                Workspace
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Travel Agency Management System
              </p>
            </div>åç

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#1E293B] bg-[#10192D] px-3 py-1 text-xs font-medium text-slate-400 sm:inline-flex">
                V1 Platform
              </span>

              <LogoutButton />
            </div>
          </header>

          {/* Page Content */}
          <main className="min-w-0 flex-1 bg-[#08090D] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
