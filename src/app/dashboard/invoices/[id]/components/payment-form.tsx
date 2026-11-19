
"use client";

import { useState } from "react";

interface PaymentFormProps {
  invoiceId: string;
  balanceDue: number;
  currencyCode: string;
  onPaymentRecorded: () => void;
}

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "USD",
  }).format(amount);
}

const inputClass =
  "app-input w-full rounded-lg px-3 py-2.5 text-sm outline-none";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-300";

export default function PaymentForm({
  invoiceId,
  balanceDue,
  currencyCode,
  onPaymentRecorded,
}: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayDate());
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (paymentAmount > balanceDue) {
      setError("Payment cannot exceed the outstanding balance.");
      return;
    }

    if (!paymentDate) {
      setError("Please select a payment date.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/invoices/${invoiceId}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: paymentAmount,
            paymentDate,
            paymentMethod,
            reference: reference.trim() || null,
            notes: notes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to record payment.");
      }

      setSuccess("Payment recorded successfully.");
      setAmount("");
      setPaymentDate(getTodayDate());
      setPaymentMethod("BANK_TRANSFER");
      setReference("");
      setNotes("");

      onPaymentRecorded();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while recording payment."
      );
    } finally {
      setSaving(false);
    }
  }

  if (balanceDue <= 0) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <p className="font-medium text-emerald-400">
          This invoice is fully paid.
        </p>
        <p className="mt-1 text-sm text-slate-400">
          No outstanding balance remains.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#1E293B] bg-[#10192D] p-4">
        <div>
          <p className="text-xs text-slate-400">
            Outstanding Balance
          </p>
          <p className="mt-1 text-xl font-semibold text-blue-400">
            {formatMoney(balanceDue, currencyCode)}
          </p>
        </div>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          Payment Pending
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Payment Amount *</label>
          <input
            type="number"
            min="0.01"
            max={balanceDue}
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter payment amount"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Payment Date *</label>
          <input
            type="date"
            required
            value={paymentDate}
            onChange={(event) => setPaymentDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Payment Method *</label>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className={inputClass}
          >
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="ONLINE_PAYMENT">Online Payment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Transaction Reference
          </label>
          <input
            type="text"
            maxLength={200}
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="e.g. Bank transaction ID"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Payment Notes</label>
          <textarea
            rows={3}
            maxLength={2000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add any additional payment information..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-[#1E293B] pt-5">
        <button
          type="submit"
          disabled={saving}
          className="app-button-primary rounded-lg px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Recording Payment..." : "Record Payment"}
        </button>
      </div>
    </form>
  );
}
