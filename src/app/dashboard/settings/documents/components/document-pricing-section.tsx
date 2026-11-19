
"use client";

import { Calculator, Percent, Tag } from "lucide-react";
import type { DocumentTotals } from "./document-types";

interface DocumentPricingSectionProps {
  subtotal: number;
  discount: number;
  taxRate: number;
  currencyCode: string;
  onDiscountChange: (value: number) => void;
  onTaxRateChange: (value: number) => void;
}

const formatCurrency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);

export function calculateDocumentTotals(
  subtotal: number,
  discount: number,
  taxRate: number
): DocumentTotals {
  const safeSubtotal = Math.max(0, subtotal);
  const safeDiscount = Math.min(
    safeSubtotal,
    Math.max(0, discount)
  );
  const taxableAmount = safeSubtotal - safeDiscount;
  const safeTaxRate = Math.max(0, Math.min(100, taxRate));
  const taxAmount = taxableAmount * (safeTaxRate / 100);

  return {
    subtotal: safeSubtotal,
    discount: safeDiscount,
    taxRate: safeTaxRate,
    taxAmount,
    totalAmount: taxableAmount + taxAmount,
  };
}

export function DocumentPricingSection({
  subtotal,
  discount,
  taxRate,
  currencyCode,
  onDiscountChange,
  onTaxRateChange,
}: DocumentPricingSectionProps) {
  const totals = calculateDocumentTotals(
    subtotal,
    discount,
    taxRate
  );

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <Calculator className="h-4 w-4 text-blue-500" />
          Pricing & Adjustments
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure discounts and tax to calculate the final amount.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Tag className="h-4 w-4 text-blue-500" />
            Discount Amount ({currencyCode})
          </label>

          <input
            type="number"
            min="0"
            max={subtotal}
            step="0.01"
            value={discount}
            onChange={(event) =>
              onDiscountChange(
                Math.min(
                  Math.max(0, subtotal),
                  Math.max(0, Number(event.target.value))
                )
              )
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Enter a fixed discount amount.
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Percent className="h-4 w-4 text-blue-500" />
            Tax Rate (%)
          </label>

          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(event) =>
              onTaxRateChange(
                Math.min(
                  100,
                  Math.max(0, Number(event.target.value))
                )
              )
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Tax is calculated after deducting the discount.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Subtotal
          </span>
          <span className="font-medium tabular-nums text-slate-800 dark:text-slate-200">
            {formatCurrency(totals.subtotal, currencyCode)}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Discount
          </span>
          <span className="font-medium tabular-nums text-red-600 dark:text-red-400">
            - {formatCurrency(totals.discount, currencyCode)}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Tax ({totals.taxRate}%)
          </span>
          <span className="font-medium tabular-nums text-slate-800 dark:text-slate-200">
            {formatCurrency(totals.taxAmount, currencyCode)}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Total Amount
            </span>

            <span className="text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300">
              {formatCurrency(totals.totalAmount, currencyCode)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
