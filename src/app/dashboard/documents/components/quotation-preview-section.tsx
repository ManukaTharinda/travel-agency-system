
"use client";

import { Eye, CalendarDays, UserRound, MapPin } from "lucide-react";

import type {
  DocumentCustomer,
  DocumentItinerary,
  DocumentLineItem,
} from "./document-types";

interface QuotationPreviewSectionProps {
  quotationNumber?: string;
  customer?: DocumentCustomer;
  itinerary?: DocumentItinerary;
  issueDate: string;
  validUntil: string;
  currencyCode: string;
  items: DocumentLineItem[];
  discount: number;
  taxRate: number;
  notes: string;
  terms: string;
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value: string) {
  if (!value) return "Not selected";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function QuotationPreviewSection({
  quotationNumber,
  customer,
  itinerary,
  issueDate,
  validUntil,
  currencyCode,
  items,
  discount,
  taxRate,
  notes,
  terms,
}: QuotationPreviewSectionProps) {
  const subtotal = items.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  const safeDiscount = Math.max(
    0,
    Math.min(Number(discount) || 0, subtotal)
  );

  const taxableAmount = Math.max(0, subtotal - safeDiscount);
  const taxAmount = Number(
    ((taxableAmount * Math.max(0, Number(taxRate) || 0)) / 100).toFixed(2)
  );
  const totalAmount = Number(
    (taxableAmount + taxAmount).toFixed(2)
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <Eye size={18} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Quotation Preview
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Review the quotation information before saving.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
          DRAFT
        </span>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Quotation
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {quotationNumber || "New Quotation"}
            </h3>
          </div>

          <div className="text-right text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Issue Date
            </p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {formatDate(issueDate)}
            </p>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Valid Until
            </p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {formatDate(validUntil)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <UserRound size={15} />
              Customer
            </div>

            <p className="font-semibold text-slate-900 dark:text-white">
              {customer
                ? `${customer.firstName} ${customer.lastName ?? ""}`.trim()
                : "No customer selected"}
            </p>

            {customer?.email && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {customer.email}
              </p>
            )}

            {customer?.phone && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {customer.phone}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <MapPin size={15} />
              Travel Details
            </div>

            <p className="font-semibold text-slate-900 dark:text-white">
              {itinerary?.title || "No itinerary selected"}
            </p>

            {itinerary && (
              <>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {itinerary.destination || "Destination not specified"}
                </p>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(itinerary.startDate)} – {formatDate(itinerary.endDate)}
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Quotation Breakdown
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.name || "Untitled item"}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">
                      {formatMoney(item.unitPrice, currencyCode)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-900 dark:text-white">
                      {formatMoney(item.lineTotal, currencyCode)}
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                      No quotation items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full space-y-3 sm:max-w-xs">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Subtotal
              </span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                {formatMoney(subtotal, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Discount
              </span>
              <span className="font-medium tabular-nums text-red-600 dark:text-red-400">
                -{formatMoney(safeDiscount, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Tax ({taxRate}%)
              </span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                {formatMoney(taxAmount, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">
                Total
              </span>
              <span className="text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {formatMoney(totalAmount, currencyCode)}
              </span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              Additional Notes
            </h4>
            <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
              {notes}
            </p>
          </div>
        )}

        {terms && (
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              Terms & Conditions
            </h4>
            <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
              {terms}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800">
          <CalendarDays size={14} />
          This is a quotation preview. It is not yet an issued document.
        </div>
      </div>
    </section>
  );
}
