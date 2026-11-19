
"use client";

import {
  FileText,
  CalendarDays,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

import type { BillingSettings } from "./billing-types";

interface QuotationSectionProps {
  settings: BillingSettings;
  updateField: (
    field: keyof BillingSettings,
    value: string | number
  ) => void;
}

export function QuotationSection({
  settings,
  updateField,
}: QuotationSectionProps) {
  return (
    <section
      id="quotation-settings"
      className="
        scroll-mt-28 overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white/90
        shadow-sm shadow-slate-200/40
        transition-colors duration-300
        dark:border-white/[0.08]
        dark:bg-slate-900/80
        dark:shadow-black/10
      "
    >
      {/* Section Header */}
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
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Quotation Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Configure quotation validity, terms and customer acceptance conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-7">

        {/* Validity Configuration */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Quotation Validity
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Set how long your travel quotations remain valid for customers.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Validity Days */}
            <div className="space-y-2">
              <label
                htmlFor="quotation-validity"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Validity Period (Days)
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="quotation-validity"
                  type="number"
                  min="1"
                  max="365"
                  step="1"
                  value={settings.quotationValidityDays}
                  onChange={(event) =>
                    updateField(
                      "quotationValidityDays",
                      Number(event.target.value)
                    )
                  }
                  placeholder="14"
                  className="
                    h-11 w-full rounded-xl
                    border border-slate-200 bg-white/80
                    pl-10 pr-4 text-sm text-slate-900
                    outline-none transition-all duration-200
                    placeholder:text-slate-400
                    hover:border-slate-300
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    dark:border-white/10 dark:bg-slate-950/50
                    dark:text-white dark:placeholder:text-slate-500
                    dark:hover:border-white/20
                    dark:focus:border-blue-400
                    dark:focus:ring-blue-400/10
                  "
                />
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                Choose between 1 and 365 days.
              </p>
            </div>

            {/* Expiry Preview */}
            <div
              className="
                flex items-center gap-3 rounded-xl
                border border-blue-100 bg-blue-50/70 p-4
                dark:border-blue-400/15 dark:bg-blue-500/[0.07]
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl bg-blue-100 text-blue-600
                  dark:bg-blue-500/15 dark:text-blue-400
                "
              >
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Default validity
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {settings.quotationValidityDays || 0} Days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Terms & Conditions
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add the standard conditions that should appear on your quotations.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="quotation-terms"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Quotation Terms
            </label>

            <textarea
              id="quotation-terms"
              rows={7}
              value={settings.quotationTerms}
              onChange={(event) =>
                updateField("quotationTerms", event.target.value)
              }
              placeholder={`1. This quotation is valid for the specified validity period.

2. Prices are subject to availability at the time of confirmation.

3. Any changes to the travel itinerary may affect the final price.

4. The final invoice will be issued after quotation confirmation.`}
              className="
                w-full resize-y rounded-xl
                border border-slate-200 bg-white/80
                px-4 py-3 text-sm leading-6 text-slate-900
                outline-none transition-all duration-200
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                dark:border-white/10 dark:bg-slate-950/50
                dark:text-white dark:placeholder:text-slate-500
                dark:hover:border-white/20
                dark:focus:border-blue-400
                dark:focus:ring-blue-400/10
              "
            />

            <p className="text-xs text-slate-400 dark:text-slate-500">
              These terms will be used as defaults when creating new quotations.
            </p>
          </div>
        </div>

        {/* Confirmation Workflow */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Quotation Confirmation Workflow
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Understand what happens when a customer accepts a quotation.
            </p>
          </div>

          <div className="space-y-3">

            {/* Step 1 */}
            <div
              className="
                flex items-start gap-3 rounded-xl
                border border-slate-200/80 bg-white/60 p-4
                dark:border-white/[0.07] dark:bg-slate-950/30
              "
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <FileText className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Quotation Created & Sent
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  The agency prepares the quotation and shares it with the customer.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="
                flex items-start gap-3 rounded-xl
                border border-slate-200/80 bg-white/60 p-4
                dark:border-white/[0.07] dark:bg-slate-950/30
              "
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Customer Confirms Quotation
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  The quotation status changes to Confirmed after customer acceptance is recorded.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className="
                flex items-start gap-3 rounded-xl
                border border-slate-200/80 bg-white/60 p-4
                dark:border-white/[0.07] dark:bg-slate-950/30
              "
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Invoice Generation
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  The agency generates an invoice using the confirmed quotation details. The original quotation remains unchanged.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Notice */}
        <div
          className="
            flex items-start gap-3 rounded-2xl
            border border-blue-100
            bg-gradient-to-br from-blue-50/80 to-indigo-50/40
            p-5 dark:border-blue-400/15
            dark:from-blue-500/[0.08] dark:to-indigo-500/[0.04]
          "
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              No Bank Details Required
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Customer quotations display tour information, pricing, taxes,
              discounts and quotation terms. Bank account information and
              payment instructions are reserved for invoices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
