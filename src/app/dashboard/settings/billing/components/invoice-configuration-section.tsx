
"use client";

import {
  Receipt,
  Percent,
  FileText,
  Hash,
} from "lucide-react";

import type { BillingSettings } from "./billing-types";

interface InvoiceConfigurationSectionProps {
  settings: BillingSettings;
  updateField: (
    field: keyof BillingSettings,
    value: string | number
  ) => void;
}

export function InvoiceConfigurationSection({
  settings,
  updateField,
}: InvoiceConfigurationSectionProps) {
  return (
    <section
      id="invoice-configuration"
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
            <Receipt className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Invoice Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your agency's default invoice and financial preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-7">
        {/* Invoice Information */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Invoice Payment Preferences
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Set the default payment conditions displayed on your invoices.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Payment Terms */}
            <div className="space-y-2">
              <label
                htmlFor="default-payment-terms"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Default Payment Terms
              </label>

              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="default-payment-terms"
                  type="text"
                  value={settings.defaultPaymentTerms}
                  onChange={(event) =>
                    updateField(
                      "defaultPaymentTerms",
                      event.target.value
                    )
                  }
                  placeholder="Payment due within 7 days"
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
                Example: Full payment required within 7 days.
              </p>
            </div>

            {/* Tax Rate */}
            <div className="space-y-2">
              <label
                htmlFor="default-tax-rate"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Default Tax Rate (%)
              </label>

              <div className="relative">
                <Percent className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="default-tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.defaultTaxRate}
                  onChange={(event) =>
                    updateField(
                      "defaultTaxRate",
                      event.target.value
                    )
                  }
                  placeholder="0"
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
                Enter a percentage between 0 and 100.
              </p>
            </div>

            {/* Tax Registration Number */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="tax-registration-number"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Tax Registration Number
              </label>

              <div className="relative">
                <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="tax-registration-number"
                  type="text"
                  value={settings.taxRegistrationNumber}
                  onChange={(event) =>
                    updateField(
                      "taxRegistrationNumber",
                      event.target.value
                    )
                  }
                  placeholder="Enter your tax registration number"
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
                Optional. Displayed on invoices when provided.
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Numbering Information */}
        <div
          className="
            rounded-2xl border border-blue-100
            bg-gradient-to-br from-blue-50/80 to-indigo-50/40
            p-5 dark:border-blue-400/15
            dark:from-blue-500/[0.08] dark:to-indigo-500/[0.04]
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl bg-blue-100 text-blue-600
                dark:bg-blue-500/15 dark:text-blue-400
              "
            >
              <Hash className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Automatic Invoice Numbering
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Invoice prefixes and sequential numbering are managed
                separately through your agency numbering configuration.
                Each generated invoice will receive its own unique number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
