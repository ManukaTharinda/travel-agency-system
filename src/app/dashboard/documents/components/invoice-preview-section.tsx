
"use client";

import {
  Eye,
  CalendarDays,
  UserRound,
  MapPin,
  CreditCard,
  Building2,
} from "lucide-react";

import type {
  DocumentCustomer,
  DocumentItinerary,
  DocumentLineItem,
} from "./document-types";

interface InvoicePreviewSectionProps {
  invoiceNumber?: string;
  customer?: DocumentCustomer;
  itinerary?: DocumentItinerary;
  issueDate: string;
  dueDate: string;
  currencyCode: string;
  items: DocumentLineItem[];
  discount: number;
  taxRate: number;
  amountPaid: number;
  notes: string;
  paymentTerms: string;
  agencyName?: string;
  agencyEmail?: string;
  agencyPhone?: string;
  agencyAddress?: string;
  agencyLogoUrl?: string;
  bankName?: string;
  bankBranch?: string;
  accountName?: string;
  accountNumber?: string;
  swiftCode?: string;
  paymentInstructions?: string;
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

export default function InvoicePreviewSection({
  invoiceNumber,
  customer,
  itinerary,
  issueDate,
  dueDate,
  currencyCode,
  items,
  discount,
  taxRate,
  amountPaid,
  notes,
  paymentTerms,
  agencyName,
  agencyEmail,
  agencyPhone,
  agencyAddress,
  agencyLogoUrl,
  bankName,
  bankBranch,
  accountName,
  accountNumber,
  swiftCode,
  paymentInstructions,
}: InvoicePreviewSectionProps) {
  const subtotal = items.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  const safeDiscount = Math.max(
    0,
    Math.min(Number(discount) || 0, subtotal)
  );

  const safeTaxRate = Math.max(
    0,
    Math.min(Number(taxRate) || 0, 100)
  );

  const taxableAmount = Math.max(0, subtotal - safeDiscount);

  const taxAmount = Number(
    ((taxableAmount * safeTaxRate) / 100).toFixed(2)
  );

  const totalAmount = Number(
    (taxableAmount + taxAmount).toFixed(2)
  );

  const safeAmountPaid = Math.max(
    0,
    Math.min(Number(amountPaid) || 0, totalAmount)
  );

  const balanceDue = Number(
    Math.max(0, totalAmount - safeAmountPaid).toFixed(2)
  );

  const paymentStatus =
    balanceDue <= 0
      ? "PAID"
      : safeAmountPaid > 0
        ? "PARTIALLY PAID"
        : "UNPAID";

  const hasBankDetails = Boolean(
    bankName ||
      bankBranch ||
      accountName ||
      accountNumber ||
      swiftCode ||
      paymentInstructions
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
              Invoice Preview
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Review invoice information before saving.
            </p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            paymentStatus === "PAID"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
              : paymentStatus === "PARTIALLY PAID"
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {paymentStatus}
        </span>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {/* Agency Details */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {agencyLogoUrl && (
              <img
                src={agencyLogoUrl}
                alt="Agency logo"
                className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain p-1 dark:border-slate-700"
              />
            )}

            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {agencyName || "Your Travel Agency"}
              </p>

              {agencyAddress && (
                <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                  {agencyAddress}
                </p>
              )}

              {agencyEmail && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {agencyEmail}
                </p>
              )}

              {agencyPhone && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {agencyPhone}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Invoice
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {invoiceNumber || "New Invoice"}
            </h3>
          </div>
        </div>

        {/* Invoice Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Issue Date
            </p>

            <p className="mt-2 font-semibold text-slate-900 dark:text-white">
              {formatDate(issueDate)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Payment Due Date
            </p>

            <p className="mt-2 font-semibold text-slate-900 dark:text-white">
              {formatDate(dueDate)}
            </p>
          </div>
        </div>

        {/* Customer and Travel Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <UserRound size={15} />
              Bill To
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

            {customer?.address && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {customer.address}
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
                  {formatDate(itinerary.startDate)} –{" "}
                  {formatDate(itinerary.endDate)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Invoice Breakdown
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Unit Price
                  </th>
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
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No invoice items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
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
                Tax ({safeTaxRate}%)
              </span>

              <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                {formatMoney(taxAmount, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">
                Total Invoice Amount
              </span>

              <span className="text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {formatMoney(totalAmount, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Amount Paid
              </span>

              <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                -{formatMoney(safeAmountPaid, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">
                Balance Due
              </span>

              <span className="text-lg font-bold tabular-nums text-red-600 dark:text-red-400">
                {formatMoney(balanceDue, currencyCode)}
              </span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {hasBankDetails && (
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <Building2 size={17} />
              </div>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Bank & Payment Details
              </h4>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {bankName && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Bank Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {bankName}
                    </p>
                  </div>
                )}

                {bankBranch && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Branch
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {bankBranch}
                    </p>
                  </div>
                )}

                {accountName && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Account Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {accountName}
                    </p>
                  </div>
                )}

                {accountNumber && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Account Number
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {accountNumber}
                    </p>
                  </div>
                )}

                {swiftCode && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      SWIFT Code
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {swiftCode}
                    </p>
                  </div>
                )}
              </div>

              {paymentInstructions && (
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Payment Instructions
                  </p>

                  <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                    {paymentInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
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

        {/* Payment Terms */}
        {paymentTerms && (
          <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
            <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
              Payment Terms
            </h4>

            <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
              {paymentTerms}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800">
          <CreditCard size={14} />
          This is an invoice preview. It is not yet an issued document.
        </div>
      </div>
    </section>
  );
}
