
"use client";

import { CalendarDays, FileText, Coins } from "lucide-react";
import type { DocumentType } from "./document-types";

interface DocumentDetailsSectionProps {
  documentType: DocumentType;
  issueDate: string;
  validUntil: string;
  dueDate: string;
  currencyCode: string;
  notes: string;
  terms: string;
  onIssueDateChange: (value: string) => void;
  onValidUntilChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onTermsChange: (value: string) => void;
}

const currencies = [
  { code: "LKR", label: "Sri Lankan Rupee (LKR)" },
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "British Pound (GBP)" },
  { code: "AUD", label: "Australian Dollar (AUD)" },
  { code: "CAD", label: "Canadian Dollar (CAD)" },
  { code: "INR", label: "Indian Rupee (INR)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "SGD", label: "Singapore Dollar (SGD)" },
];

export function DocumentDetailsSection({
  documentType,
  issueDate,
  validUntil,
  dueDate,
  currencyCode,
  notes,
  terms,
  onIssueDateChange,
  onValidUntilChange,
  onDueDateChange,
  onCurrencyChange,
  onNotesChange,
  onTermsChange,
}: DocumentDetailsSectionProps) {
  const isQuotation = documentType === "quotation";

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <FileText className="h-4 w-4 text-blue-500" />
          Document Details
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure the dates, currency and additional document information.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Issue Date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            Issue Date
            <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            value={issueDate}
            onChange={(event) => onIssueDateChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>

        {/* Quotation validity or Invoice due date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            {isQuotation ? "Valid Until" : "Payment Due Date"}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            value={isQuotation ? validUntil : dueDate}
            min={issueDate || undefined}
            onChange={(event) =>
              isQuotation
                ? onValidUntilChange(event.target.value)
                : onDueDateChange(event.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            {isQuotation
              ? "The last date this quotation remains valid."
              : "The date by which payment should be completed."}
          </p>
        </div>

        {/* Currency */}
        <div className="sm:col-span-2">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Coins className="h-4 w-4 text-blue-500" />
            Currency
          </label>

          <select
            value={currencyCode}
            onChange={(event) => onCurrencyChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Additional Notes
            <span className="ml-1 text-xs font-normal text-slate-400">
              (Optional)
            </span>
          </label>

          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={3}
            placeholder="Add any additional information for the customer..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>

        {/* Terms */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {isQuotation ? "Quotation Terms & Conditions" : "Payment Terms"}
            <span className="ml-1 text-xs font-normal text-slate-400">
              (Optional)
            </span>
          </label>

          <textarea
            value={terms}
            onChange={(event) => onTermsChange(event.target.value)}
            rows={4}
            placeholder={
              isQuotation
                ? "Enter quotation validity, cancellation policy, inclusions and other conditions..."
                : "Enter payment instructions, payment deadline and other payment conditions..."
            }
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            {isQuotation
              ? "Bank details are intentionally excluded from quotations."
              : "Invoice payment and bank information will be included in the invoice document."}
          </p>
        </div>
      </div>
    </section>
  );
}
