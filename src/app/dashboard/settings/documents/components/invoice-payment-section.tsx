
"use client";

import { Banknote, Wallet, CircleDollarSign } from "lucide-react";

interface InvoicePaymentSectionProps {
  totalAmount: number;
  amountPaid: number;
  currencyCode: string;
  onAmountPaidChange: (value: number) => void;
}

const formatCurrency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);

export function InvoicePaymentSection({
  totalAmount,
  amountPaid,
  currencyCode,
  onAmountPaidChange,
}: InvoicePaymentSectionProps) {
  const safeAmountPaid = Math.min(
    Math.max(0, amountPaid),
    Math.max(0, totalAmount)
  );

  const balanceDue = Math.max(0, totalAmount - safeAmountPaid);

  const paymentStatus =
    totalAmount <= 0
      ? "No amount"
      : balanceDue === 0
        ? "Fully Paid"
        : safeAmountPaid > 0
          ? "Partially Paid"
          : "Unpaid";

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <Wallet className="h-4 w-4 text-blue-500" />
          Invoice Payment
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Record any payment already received from the customer.
        </p>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Banknote className="h-4 w-4 text-blue-500" />
          Amount Already Paid ({currencyCode})
        </label>

        <input
          type="number"
          min="0"
          max={totalAmount}
          step="0.01"
          value={amountPaid}
          onChange={(event) =>
            onAmountPaidChange(
              Math.min(
                Math.max(0, Number(event.target.value)),
                Math.max(0, totalAmount)
              )
            )
          }
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:max-w-md"
        />

        <p className="mt-1.5 text-xs text-slate-400">
          Enter zero if the customer has not made a payment yet.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Amount Received
          </p>

          <p className="mt-2 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
            {formatCurrency(safeAmountPaid, currencyCode)}
          </p>
        </div>

        <div className="rounded-xl border border-blue-200/70 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Remaining Balance
          </p>

          <p className="mt-2 text-lg font-bold tabular-nums text-blue-700 dark:text-blue-300">
            {formatCurrency(balanceDue, currencyCode)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/70 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Payment Status
          </span>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            paymentStatus === "Fully Paid"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : paymentStatus === "Partially Paid"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {paymentStatus}
        </span>
      </div>
    </section>
  );
}
