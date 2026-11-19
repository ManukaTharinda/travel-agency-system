
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Globe,
  RefreshCw,
  Loader2,
  AlertCircle,
  UsersRound,
} from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "ARCHIVED"
  >("ALL");

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/customers", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load customers.");
      }

      setCustomers(
        Array.isArray(data.customers) ? data.customers : []
      );
    } catch (err) {
      console.error("Fetch customers error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const statistics = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((customer) => customer.status === "ACTIVE")
        .length,
      archived: customers.filter(
        (customer) => customer.status === "ARCHIVED"
      ).length,
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const fullName = [
        customer.firstName,
        customer.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchTerm ||
        fullName.includes(searchTerm) ||
        (customer.email || "").toLowerCase().includes(searchTerm) ||
        (customer.phone || "").toLowerCase().includes(searchTerm) ||
        (customer.nationality || "").toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 pb-10">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Workspace
          </p>

          <h1 className="mt-1 text-xl font-bold text-[#F8FAFC] sm:text-2xl">
            Customers
          </h1>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Manage your travel agency customers and their information.
          </p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1760F5] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#1E293B] bg-[#050914] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">Total Customers</p>
            <Users className="h-4 w-4 text-blue-400" />
          </div>

          <p className="mt-3 text-2xl font-bold text-[#F8FAFC]">
            {statistics.total}
          </p>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#050914] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">Active Customers</p>
            <UsersRound className="h-4 w-4 text-emerald-400" />
          </div>

          <p className="mt-3 text-2xl font-bold text-emerald-400">
            {statistics.active}
          </p>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#050914] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">Archived Customers</p>
            <Users className="h-4 w-4 text-amber-400" />
          </div>

          <p className="mt-3 text-2xl font-bold text-amber-400">
            {statistics.archived}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <section className="rounded-xl border border-[#1E293B] bg-[#050914] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone..."
              className="h-10 w-full rounded-lg border border-[#1E293B] bg-[#10192D] pl-9 pr-3 text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#1760F5]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["ALL", "ACTIVE", "ARCHIVED"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-[#1760F5] text-white"
                    : "border border-[#1E293B] bg-[#10192D] text-[#94A3B8] hover:text-white"
                }`}
              >
                {status === "ALL"
                  ? "All"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />

            <div>
              <p className="text-sm font-semibold text-rose-400">
                Unable to load customers
              </p>
              <p className="mt-1 text-xs text-[#94A3B8]">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchCustomers}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#1E293B] bg-[#10192D] px-3 text-sm text-[#E2E8F0] hover:bg-[#17243B]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Customer Table */}
      {!error && (
        <section className="overflow-hidden rounded-xl border border-[#1E293B] bg-[#050914]">

          <div className="flex items-center justify-between border-b border-[#1E293B] px-4 py-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F8FAFC]">
                Customer Directory
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                {filteredCustomers.length} customers found
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCustomers}
              disabled={loading}
              aria-label="Refresh customers"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E293B] bg-[#10192D] text-[#94A3B8] transition-colors hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#1760F5]" />
              <p className="mt-3 text-sm text-[#94A3B8]">
                Loading customers...
              </p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#10192D] text-[#64748B]">
                <Users className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#F8FAFC]">
                {search || statusFilter !== "ALL"
                  ? "No matching customers"
                  : "No customers yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs text-[#64748B]">
                {search || statusFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "Add your first customer to start creating personalized travel itineraries."}
              </p>

              {!search && statusFilter === "ALL" && (
                <Link
                  href="/dashboard/customers/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1760F5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Your First Customer
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-[#1E293B] bg-[#080F1E] text-xs text-[#64748B]">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Nationality</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-[#1E293B]/70 transition-colors last:border-0 hover:bg-[#10192D]/60"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-400">
                            {customer.firstName.charAt(0).toUpperCase()}
                          </div>

                          <p className="text-sm font-medium text-[#E2E8F0]">
                            {customer.firstName} {customer.lastName || ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {customer.email || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {customer.phone || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Globe className="h-3.5 w-3.5 shrink-0" />
                          {customer.nationality || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                            customer.status === "ACTIVE"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
