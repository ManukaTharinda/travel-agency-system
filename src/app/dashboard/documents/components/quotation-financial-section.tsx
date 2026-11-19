
"use client";

import { Calculator, FileText, Percent, Coins } from "lucide-react";

interface QuotationFinancialSectionProps {
  currencyCode: string;
  discount: number;
  taxRate: number;
  notes: string;
  terms: string;
  subtotal: number;
  onCurrencyChange: (value: string) => void;
  onDiscountChange: (value: number) => void;
  onTaxRateChange: (value: number) => void;
  onNotesChange: (value: string) => void;
  onTermsChange: (value: string) => void;
}

const currencies = [
  { value: "LKR", label: "Sri Lankan Rupee (LKR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "AED", label: "UAE Dirham (AED)" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

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

export default function QuotationFinancialSection({
  currencyCode,
  discount,
  taxRate,
  notes,
  terms,
  subtotal,
  onCurrencyChange,
  onDiscountChange,
  onTaxRateChange,
  onNotesChange,
  onTermsChange,
}: QuotationFinancialSectionProps) {
  const safeSubtotal = Number.isFinite(subtotal)
    ? Math.max(0, subtotal)
    : 0;

  const safeDiscount = Number.isFinite(discount)
    ? Math.max(0, Math.min(discount, safeSubtotal))
    : 0;

  const safeTaxRate = Number.isFinite(taxRate)
    ? Math.max(0, Math.min(taxRate, 100))
    : 0;

  const taxableAmount = Math.max(0, safeSubtotal - safeDiscount);
  const taxAmount = Number(
    ((taxableAmount * safeTaxRate) / 100).toFixed(2)
  );
  const totalAmount = Number(
    (taxableAmount + taxAmount).toFixed(2)
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
          <Calculator size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Financial Details
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Configure currency, discounts, taxes and quotation terms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <Coins size={15} />
              Currency
            </span>
          </label>

          <select
            value={currencyCode}
            onChange={(event) => onCurrencyChange(event.target.value)}
            className={inputClass}
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Discount Amount</label>

          <input
            type="number"
            min="0"
            max={safeSubtotal}
            step="0.01"
            value={discount}
            onChange={(event) =>
              onDiscountChange(Number(event.target.value))
            }
            className={inputClass}
          />

          <p className="mt-1.5 text-xs text-slate-500">
            Maximum: {formatMoney(safeSubtotal, currencyCode)}
          </p>
        </div>

        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <Percent size={15} />
              Tax Rate (%)
            </span>
          </label>

          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(event) =>
              onTaxRateChange(Number(event.target.value))
            }
            className={inputClass}
          />

          <p className="mt-1.5 text-xs text-slate-500">
            Enter 0 if no tax applies.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Quotation Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400">
              Subtotal
            </span>
            <span className="font-medium tabular-nums text-slate-900 dark:text-white">
              {formatMoney(safeSubtotal, currencyCode)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400">
              Discount
            </span>
            <span className="font-medium tabular-nums text-red-600 dark:text-red-400">
              -{formatMoney(safeDiscount, currencyCode)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-slate-400">
              Tax ({safeTaxRate}%)
            </span>
            <span className="font-medium tabular-nums text-slate-900 dark:text-white">
              {formatMoney(taxAmount, currencyCode)}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <div className="flex justify-between gap-4">
              <span className="font-semibold text-slate-900 dark:text-white">
                Total Quotation Amount
              </span>
              <span className="text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {formatMoney(totalAmount, currencyCode)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <FileText size={15} />
              Additional Notes
            </span>
          </label>

          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Add additional information for the customer..."
            className={`${inputClass} resize-y`}
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {notes.length}/2000
          </p>
        </div>

        <div>
          <label className={labelClass}>
            Terms & Conditions
          </label>

          <textarea
            value={terms}
            onChange={(event) => onTermsChange(event.target.value)}
            rows={4}
            maxLength={5000}
            placeholder="Enter quotation terms, cancellation policies, payment conditions and other important details..."
            className={`${inputClass} resize-y`}
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {terms.length}/5000
          </p>
        </div>
      </div>
    </section>
  );
}
