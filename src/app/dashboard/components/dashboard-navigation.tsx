
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  Plane,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Itineraries", href: "/dashboard/itineraries", icon: Map },
  { title: "Documents", href: "/dashboard/documents", icon: FileText },
  { title: "Customers", href: "/dashboard/customers", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const NavigationLinks = () => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                : "border-transparent text-slate-400 hover:bg-[#10192D] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-[18px] w-[18px]" />
              {item.title}
            </span>
            {active && <ChevronRight className="h-4 w-4" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E293B] bg-[#10192D] text-slate-300 md:hidden"
        >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#1E293B] bg-[#050914] md:flex">
        <div className="flex h-20 items-center gap-3 border-b border-[#1E293B] px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1760F5] text-white">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Travel Agency</h1>
            <p className="mt-0.5 text-xs text-slate-500">Management System</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>
          <NavigationLinks />
        </div>

        <div className="border-t border-[#1E293B] p-4">
          <div className="rounded-lg border border-[#1E293B] bg-[#080D19] p-3">
            <p className="text-xs font-medium text-slate-300">
              Travel Management
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Version 1.0</p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-[#1E293B] bg-[#050914]">
            <div className="flex h-20 items-center justify-between border-b border-[#1E293B] px-5">
              <div className="flex items-center gap-3">
                <Plane className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-bold text-white">
                  Travel Agency
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-slate-400 hover:bg-[#10192D]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 px-4 py-6">
              <NavigationLinks />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
