
"use client";

import {
  Eye,
  FileText,
  Receipt,
  Building2,
  CalendarDays,
  CreditCard,
} from "lucide-react";

import type { BillingSettings, DocumentType } from "./billing-types";

interface BillingPreviewSectionProps {
  settings: BillingSettings;
  documentType: DocumentType;
}

export function BillingPreviewSection({
  settings,
  documentType,
}: BillingPreviewSectionProps) {
  const isInvoice = documentType === "invoice";

  return (
    <section
      id="billing-preview"
      className="
        overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white/90
        shadow-sm shadow-slate-200/40
        transition-colors duration-300
        dark:border-white/[0.08]
        dark:bg-slate-900/80
        dark:shadow-black/10
      "
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-6 dark:border-white/[0.07] md:px-7">
        <div className="flex items-center gap-4">
          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-2xl border border-blue-100
              bg-gradient-to-br from-blue-50 to-indigo-100
              text-blue-600 shadow-sm
              dark:border-blue-400/20
              dark:from-blue-500/15 dark:to-indigo-500/10
              dark:text-blue-400
            "
          >
            <Eye className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Document Preview
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Preview how your {isInvoice ? "invoice" : "quotation"} settings will appear.
            </p>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-5 md:p-7">
        <div
          className="
            mx-auto max-w-2xl overflow-hidden rounded-2xl
            border border-slate-200 bg-white
            shadow-lg shadow-slate-200/50
            dark:border-white/10 dark:bg-slate-950
            dark:shadow-black/20
          "
        >
          {/* Document Top */}
          <div className="border-b border-slate-100 p-6 dark:border-white/10 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                    {isInvoice ? (
                      <Receipt className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>

                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    YOUR COMPANY
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Travel Agency Management System
                </p>
              </div>

              <div className="text-right">
                <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isInvoice ? "Invoice" : "Quotation"}
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {isInvoice ? "INV-00001" : "QUO-00001"}
                </p>

                <span
                  className={`
                    mt-2 inline-flex rounded-full px-3 py-1
                    text-[10px] font-semibold uppercase tracking-wider
                    ${
                      isInvoice
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    }
                  `}
                >
                  Preview
                </span>
              </div>
            </div>
          </div>

          {/* Customer and Date */}
          <div className="grid gap-6 border-b border-slate-100 p-6 dark:border-white/10 md:grid-cols-2 md:p-8">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Bill To
              </p>

              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Customer Name
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Customer address
              </p>

              <p className="mt-1 text-xs text-slate-500">
                customer@example.com
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {isInvoice ? "Invoice Date" : "Quotation Date"}
                </span>

                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  DD/MM/YYYY
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {isInvoice ? "Payment Terms" : "Valid For"}
                </span>

                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {isInvoice
                    ? settings.defaultPaymentTerms || "Not configured"
                    : `${settings.quotationValidityDays} days`}
                </span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 md:p-8">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {isInvoice ? "Invoice Details" : "Quotation Details"}
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
              <div className="grid grid-cols-[1fr_auto] gap-3 bg-slate-50 px-4 py-3 dark:bg-white/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Amount
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-5">
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Sri Lanka Tour Package
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Sample travel service
                  </p>
                </div>

                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  LKR 100,000.00
                </p>
              </div>
            </div>

            {/* Totals */}
            <div className="ml-auto mt-5 max-w-xs space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Subtotal
                </span>

                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  LKR 100,000.00
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Tax ({settings.defaultTaxRate || "0"}%)
                </span>

                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Calculated at creation
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 dark:border-white/10">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Total
                </span>

                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  LKR 100,000.00
                </span>
              </div>
            </div>
          </div>

          {/* Invoice-only Bank Details */}
          {isInvoice && (
            <div className="mx-6 mb-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.03] md:mx-8">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Bank & Payment Details
                </h4>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <PreviewField
                  label="Bank Name"
                  value={settings.bankName}
                />

                <PreviewField
                  label="Branch"
                  value={settings.bankBranch}
                />

                <PreviewField
                  label="Account Name"
                  value={settings.accountName}
                />

                <PreviewField
                  label="Account Number"
                  value={settings.accountNumber}
                />

                <PreviewField
                  label="SWIFT / BIC"
                  value={settings.swiftCode}
                />

                <PreviewField
                  label="Tax Registration"
                  value={settings.taxRegistrationNumber}
                />
              </div>

              {settings.paymentInstructions && (
                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-white/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Payment Instructions
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {settings.paymentInstructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Terms */}
          <div className="border-t border-slate-100 p-6 dark:border-white/10 md:p-8">
            <div className="mb-3 flex items-center gap-2">
              {isInvoice ? (
                <Building2 className="h-4 w-4 text-slate-400" />
              ) : (
                <CalendarDays className="h-4 w-4 text-slate-400" />
              )}

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Terms & Conditions
              </h4>
            </div>

            <p className="whitespace-pre-wrap text-xs leading-6 text-slate-500 dark:text-slate-400">
              {isInvoice
                ? settings.defaultPaymentTerms || "Payment terms will appear here."
                : settings.quotationTerms || "Quotation terms will appear here."}
            </p>

            {!isInvoice && (
              <p className="mt-3 flex items-center gap-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CalendarDays className="h-3.5 w-3.5" />
                Valid for {settings.quotationValidityDays} days
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-[10px] text-slate-400">
              Thank you for choosing our travel services.
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          This is a sample preview. Actual documents will use customer,
          agency, itinerary and pricing information.
        </p>
      </div>
    </section>
  );
}

function PreviewField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-medium text-slate-700 dark:text-slate-300">
        {value || "Not configured"}
      </p>
    </div>
  );
}
