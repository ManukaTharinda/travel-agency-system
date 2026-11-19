
"use client";

import {
  Banknote,
  Building2,
  CreditCard,
  Hash,
  Landmark,
  Wallet,
} from "lucide-react";

import type { BillingSettings } from "./billing-types";

interface BankPaymentSectionProps {
  settings: BillingSettings;
  updateField: (
    field: keyof BillingSettings,
    value: string | number
  ) => void;
}

export function BankPaymentSection({
  settings,
  updateField,
}: BankPaymentSectionProps) {
  return (
    <section
      id="bank-payment"
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
            <Banknote className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Bank & Payment Details
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage the bank account and payment information displayed on your invoices.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-7">

        {/* Bank Information */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Bank Account Information
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter the official bank account details of your agency.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Bank Name */}
            <div className="space-y-2">
              <label
                htmlFor="bank-name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Bank Name
              </label>

              <div className="relative">
                <Landmark className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="bank-name"
                  type="text"
                  value={settings.bankName}
                  onChange={(event) =>
                    updateField("bankName", event.target.value)
                  }
                  placeholder="e.g. Commercial Bank"
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
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label
                htmlFor="bank-branch"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Bank Branch
              </label>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="bank-branch"
                  type="text"
                  value={settings.bankBranch}
                  onChange={(event) =>
                    updateField("bankBranch", event.target.value)
                  }
                  placeholder="e.g. Colombo Main Branch"
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
            </div>

            {/* Account Holder */}
            <div className="space-y-2">
              <label
                htmlFor="account-name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Account Holder Name
              </label>

              <div className="relative">
                <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="account-name"
                  type="text"
                  value={settings.accountName}
                  onChange={(event) =>
                    updateField("accountName", event.target.value)
                  }
                  placeholder="Enter account holder name"
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
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label
                htmlFor="account-number"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Account Number
              </label>

              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="account-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={settings.accountNumber}
                  onChange={(event) =>
                    updateField("accountNumber", event.target.value)
                  }
                  placeholder="Enter bank account number"
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
            </div>

            {/* SWIFT Code */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="swift-code"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                SWIFT / BIC Code
              </label>

              <div className="relative">
                <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="swift-code"
                  type="text"
                  value={settings.swiftCode}
                  onChange={(event) =>
                    updateField("swiftCode", event.target.value)
                  }
                  placeholder="Enter SWIFT or BIC code"
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
                Optional. Useful for international bank transfers.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Payment Instructions
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Provide clear payment instructions for your customers.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="payment-instructions"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Instructions
            </label>

            <textarea
              id="payment-instructions"
              rows={5}
              value={settings.paymentInstructions}
              onChange={(event) =>
                updateField(
                  "paymentInstructions",
                  event.target.value
                )
              }
              placeholder="Please transfer the payment to the bank account mentioned above and share the payment receipt with our agency..."
              className="
                w-full resize-y rounded-xl
                border border-slate-200 bg-white/80
                px-4 py-3 text-sm text-slate-900
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
              These instructions will appear on generated invoices.
            </p>
          </div>
        </div>

        {/* Information Notice */}
        <div
          className="
            flex items-start gap-3 rounded-2xl
            border border-blue-100
            bg-gradient-to-br from-blue-50/80 to-indigo-50/40
            p-5 dark:border-blue-400/15
            dark:from-blue-500/[0.08] dark:to-indigo-500/[0.04]
          "
        >
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl bg-blue-100 text-blue-600
              dark:bg-blue-500/15 dark:text-blue-400
            "
          >
            <Banknote className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Invoice Payment Information
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Bank information and payment instructions are used only
              when generating invoices. They are not displayed on
              customer quotations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
