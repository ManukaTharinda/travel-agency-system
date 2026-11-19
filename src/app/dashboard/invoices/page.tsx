
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  customerName: string;
  customerEmail: string | null;
  issueDate: string;
  dueDate: string | null;
  currencyCode: string;
  totalAmount: number | string;
  amountPaid: number | string;
  balanceDue: number | string;
  sourceQuotationId: string | null;
  createdAt: string;
}

function money(value: number | string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "USD",
  }).format(Number(value) || 0);
}

function date(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function statusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PARTIALLY_PAID":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "SENT":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "OVERDUE":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "CANCELLED":
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
}

export default function InvoicesPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      const response = await fetch(
        `/api/invoices?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load invoices.");
      }

      setInvoices(data.invoices || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading invoices."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadInvoices();
    }, 300);

    return () => clearTimeout(timeout);
  }, [loadInvoices]);

  const statistics = useMemo(() => {
    return {
      total: invoices.length,

      drafts: invoices.filter(
        (invoice) => invoice.status === "DRAFT"
      ).length,

      paid: invoices.filter(
        (invoice) => invoice.status === "PAID"
      ).length,

      outstanding: invoices
        .filter(
          (invoice) =>
            invoice.status !== "CANCELLED" &&
            invoice.status !== "DRAFT"
        )
        .reduce(
          (sum, invoice) => sum + Number(invoice.balanceDue),
          0
        ),
    };
  }, [invoices]);

  return (
    <div className="app-page-container max-w-6xl space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage customer invoices and track payments.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/invoices/new")}
          className="app-button-primary rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          + Create Invoice
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="app-card rounded-xl border border-[#1E293B] p-5">
          <p className="text-sm text-slate-400">Total Invoices</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {statistics.total}
          </p>
        </div>

        <div className="app-card rounded-xl border border-[#1E293B] p-5">
          <p className="text-sm text-slate-400">Draft Invoices</p>
          <p className="mt-3 text-2xl font-semibold text-amber-400">
            {statistics.drafts}
          </p>
        </div>

        <div className="app-card rounded-xl border border-[#1E293B] p-5">
          <p className="text-sm text-slate-400">Paid Invoices</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-400">
            {statistics.paid}
          </p>
        </div>

        <div className="app-card rounded-xl border border-[#1E293B] p-5">
          <p className="text-sm text-slate-400">
            Outstanding Balance
          </p>
          <p className="mt-3 text-xl font-semibold text-blue-400">
            {money(statistics.outstanding, "LKR")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Displayed in LKR equivalent only when invoices use LKR.
            Mixed currencies are not converted.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="app-card flex flex-col gap-4 rounded-xl border border-[#1E293B] p-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoice number, customer name or email..."
            className="app-input w-full rounded-lg px-4 py-2.5 text-sm outline-none"
          />
        </div>

        <div className="sm:w-52">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2.5 text-sm outline-none"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <button
          onClick={loadInvoices}
          className="app-button-secondary rounded-lg px-4 py-2.5 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Invoice Table */}
      <div className="app-card overflow-hidden rounded-xl border border-[#1E293B]">
        <div className="flex items-center justify-between border-b border-[#1E293B] px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">
              Invoice Directory
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {invoices.length} invoice{invoices.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading invoices...
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={loadInvoices}
              className="app-button-secondary mt-4 rounded-lg px-4 py-2 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10192D]">
              <span className="text-xl text-blue-400">▤</span>
            </div>

            <h3 className="mt-4 font-medium text-white">
              No invoices found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {search || status
                ? "Try changing your search or status filter."
                : "Create your first invoice to get started."}
            </p>

            {!search && !status && (
              <button
                onClick={() => router.push("/dashboard/invoices/new")}
                className="app-button-primary mt-5 rounded-lg px-4 py-2.5 text-sm"
              >
                Create Invoice
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#1E293B] bg-[#080F1E] text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4 font-medium">
                    Invoice
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Customer
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Issue Date
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Total
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Balance Due
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-[#1E293B] transition hover:bg-[#10192D]/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">
                        {invoice.invoiceNumber}
                      </p>

                      {invoice.sourceQuotationId && (
                        <p className="mt-1 text-xs text-slate-500">
                          From quotation
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-200">
                        {invoice.customerName}
                      </p>
                      {invoice.customerEmail && (
                        <p className="mt-1 text-xs text-slate-500">
                          {invoice.customerEmail}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {date(invoice.issueDate)}
                    </td>

                    <td className="px-5 py-4 font-medium text-white">
                      {money(invoice.totalAmount, invoice.currencyCode)}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-300">
                      {money(invoice.balanceDue, invoice.currencyCode)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(
                          invoice.status
                        )}`}
                      >
                        {invoice.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/invoices/${invoice.id}`)
                        }
                        className="rounded-lg border border-[#334155] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
                      >
                        View Invoice →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
