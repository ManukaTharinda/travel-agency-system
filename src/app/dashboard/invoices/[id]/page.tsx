
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PaymentForm from "./components/payment-form";

interface InvoiceItem {
  id: string;
  category: string | null;
  name: string;
  description: string | null;
  quantity: number | string;
  unitPrice: number | string;
  lineTotal: number | string;
}

interface InvoicePayment {
  id: string;
  amount: number | string;
  paymentDate: string;
  paymentMethod: string | null;
  reference: string | null;
  notes: string | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string | null;

  agencyName: string;
  agencyEmail: string | null;
  agencyPhone: string | null;
  agencyAddress: string | null;
  agencyLogoUrl: string | null;

  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;

  currencyCode: string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  totalAmount: number | string;
  amountPaid: number | string;
  balanceDue: number | string;

  notes: string | null;
  paymentTerms: string | null;

  bankName: string | null;
  bankBranch: string | null;
  accountName: string | null;
  accountNumber: string | null;
  swiftCode: string | null;
  paymentInstructions: string | null;

  items: InvoiceItem[];
  payments: InvoicePayment[];

  sourceItinerary: {
    id: string;
    referenceCode: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
  } | null;

  sourceQuotation: {
    id: string;
    quotationNumber: string;
    status: string;
  } | null;
}

function formatMoney(value: number | string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "USD",
  }).format(Number(value) || 0);
}

function formatDate(value: string | null) {
  if (!value) return "Not specified";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function statusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PARTIALLY_PAID":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "SENT":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "OVERDUE":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "CANCELLED":
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
}

export default function InvoiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load invoice details.
  const loadInvoice = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(`/api/invoices/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load invoice.");
      }

      setInvoice(data.invoice);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      loadInvoice();
    }
  }, [params.id, loadInvoice]);

  if (loading) {
    return (
      <div className="app-page-container py-12 text-center text-sm text-slate-400">
        Loading invoice...
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="app-page-container py-10">
        <div className="app-card rounded-xl border border-[#1E293B] p-6">
          <p className="text-sm text-red-400">
            {error || "Invoice not found."}
          </p>

          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="app-button-secondary mt-5 rounded-lg px-4 py-2 text-sm"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const currency = invoice.currencyCode;
  const balanceDue = Number(invoice.balanceDue) || 0;

  return (
    <div className="app-page-container max-w-6xl space-y-6 py-8">
      {/* Header and Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
        <div>
          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="mb-3 text-sm text-slate-400 hover:text-white"
          >
            ← Back to Invoices
          </button>

          <h1 className="text-2xl font-semibold text-white">
            Invoice Details
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {invoice.invoiceNumber}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="app-button-secondary rounded-lg px-4 py-2.5 text-sm"
          >
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E293B] bg-[#050914] p-4 print:hidden">
        <div>
          <p className="text-xs text-slate-400">Invoice Number</p>
          <p className="mt-1 font-semibold text-white">
            {invoice.invoiceNumber}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">Current Status</p>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyle(
              invoice.status
            )}`}
          >
            {invoice.status.replaceAll("_", " ")}
          </span>
        </div>

        <div>
          <p className="text-xs text-slate-400">Invoice Date</p>
          <p className="mt-1 text-sm text-white">
            {formatDate(invoice.issueDate)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Due Date</p>
          <p className="mt-1 text-sm text-white">
            {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* Printable Invoice Document */}
      <div
        id="invoice-print-area"
        className="rounded-xl border border-[#1E293B] bg-white p-5 text-slate-900 shadow-sm sm:p-8 lg:p-10 print:border-0 print:p-0 print:shadow-none"
      >
        {/* Agency and Invoice Heading */}
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-7 sm:flex-row">
          <div>
            {invoice.agencyLogoUrl && (
              <img
                src={invoice.agencyLogoUrl}
                alt="Agency logo"
                className="mb-4 h-14 max-w-40 object-contain"
              />
            )}

            <h2 className="text-xl font-bold text-slate-900">
              {invoice.agencyName}
            </h2>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              {invoice.agencyAddress && (
                <p>{invoice.agencyAddress}</p>
              )}
              {invoice.agencyEmail && <p>{invoice.agencyEmail}</p>}
              {invoice.agencyPhone && <p>{invoice.agencyPhone}</p>}
            </div>
          </div>

          <div className="sm:text-right">
            <h1 className="text-3xl font-bold uppercase tracking-wide text-blue-700">
              Invoice
            </h1>

            <p className="mt-3 font-semibold text-slate-900">
              {invoice.invoiceNumber}
            </p>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <p>Issue Date: {formatDate(invoice.issueDate)}</p>
              <p>Due Date: {formatDate(invoice.dueDate)}</p>
            </div>

            <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {invoice.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid gap-6 border-b border-slate-200 py-7 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Bill To
            </p>

            <h3 className="font-semibold text-slate-900">
              {invoice.customerName}
            </h3>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              {invoice.customerAddress && (
                <p>{invoice.customerAddress}</p>
              )}
              {invoice.customerEmail && (
                <p>{invoice.customerEmail}</p>
              )}
              {invoice.customerPhone && (
                <p>{invoice.customerPhone}</p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Related Travel Information
            </p>

            {invoice.sourceItinerary ? (
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-900">
                  {invoice.sourceItinerary.title}
                </p>

                <p className="text-slate-500">
                  Reference: {invoice.sourceItinerary.referenceCode}
                </p>

                <p className="text-slate-500">
                  Destination: {invoice.sourceItinerary.destination}
                </p>

                <p className="text-slate-500">
                  {formatDate(invoice.sourceItinerary.startDate)} –{" "}
                  {formatDate(invoice.sourceItinerary.endDate)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No itinerary linked.
              </p>
            )}

            {invoice.sourceQuotation && (
              <p className="mt-2 text-xs text-slate-500">
                Quotation: {invoice.sourceQuotation.quotationNumber}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-7">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
            Invoice Items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3 font-semibold">
                    Description
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Qty
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Unit Price
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-3 py-4">
                      <p className="font-medium text-slate-900">
                        {item.name}
                      </p>

                      {item.category && (
                        <p className="mt-1 text-xs text-slate-400">
                          {item.category}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-4 text-right text-slate-600">
                      {Number(item.quantity).toLocaleString()}
                    </td>

                    <td className="px-3 py-4 text-right text-slate-600">
                      {formatMoney(item.unitPrice, currency)}
                    </td>

                    <td className="px-3 py-4 text-right font-medium text-slate-900">
                      {formatMoney(item.lineTotal, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end border-b border-slate-200 pb-7">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">
                {formatMoney(invoice.subtotal, currency)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Discount</span>
              <span>
                - {formatMoney(invoice.discount, currency)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax</span>
              <span>{formatMoney(invoice.tax, currency)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatMoney(invoice.totalAmount, currency)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid</span>
              <span className="text-emerald-700">
                {formatMoney(invoice.amountPaid, currency)}
              </span>
            </div>

            <div className="flex justify-between rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold">
              <span className="text-slate-800">Balance Due</span>
              <span className="text-blue-700">
                {formatMoney(invoice.balanceDue, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {(invoice.bankName ||
          invoice.accountNumber ||
          invoice.paymentInstructions) && (
          <div className="border-b border-slate-200 py-7">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-700">
              Payment Information
            </h3>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {invoice.bankName && (
                <p>Bank: {invoice.bankName}</p>
              )}

              {invoice.bankBranch && (
                <p>Branch: {invoice.bankBranch}</p>
              )}

              {invoice.accountName && (
                <p>Account Name: {invoice.accountName}</p>
              )}

              {invoice.accountNumber && (
                <p>Account Number: {invoice.accountNumber}</p>
              )}

              {invoice.swiftCode && (
                <p>SWIFT Code: {invoice.swiftCode}</p>
              )}
            </div>

            {invoice.paymentInstructions && (
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-500">
                {invoice.paymentInstructions}
              </p>
            )}
          </div>
        )}

        {/* Payment History */}
        {invoice.payments.length > 0 && (
          <div className="border-b border-slate-200 py-7">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
              Payment History
            </h3>

            <div className="space-y-3">
              {invoice.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {formatDate(payment.paymentDate)}
                    </p>

                    <p className="text-xs text-slate-500">
                      {payment.paymentMethod || "Payment"}
                      {payment.reference
                        ? ` · ${payment.reference}`
                        : ""}
                    </p>

                    {payment.notes && (
                      <p className="mt-1 text-xs text-slate-400">
                        {payment.notes}
                      </p>
                    )}
                  </div>

                  <p className="font-semibold text-emerald-700">
                    {formatMoney(payment.amount, currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes and Terms */}
        {(invoice.notes || invoice.paymentTerms) && (
          <div className="grid gap-6 py-7 sm:grid-cols-2">
            {invoice.notes && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Notes
                </h3>

                <p className="whitespace-pre-wrap text-sm text-slate-600">
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.paymentTerms && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Payment Terms
                </h3>

                <p className="whitespace-pre-wrap text-sm text-slate-600">
                  {invoice.paymentTerms}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 text-center">
          <p className="text-sm font-semibold text-slate-700">
            Thank you for choosing {invoice.agencyName}.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            We appreciate your business.
          </p>
        </div>
      </div>

      {/* Payment Management - Not Included in Printed Invoice */}
      <section className="app-card space-y-5 rounded-xl border border-[#1E293B] p-5 sm:p-6 print:hidden">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Payment Management
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Record deposits, partial payments and final payments for this invoice.
          </p>
        </div>

        {invoice.status === "DRAFT" ||
        invoice.status === "CANCELLED" ? (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-sm font-medium text-amber-400">
              Payments are unavailable for this invoice.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {invoice.status === "DRAFT"
                ? "Issue the invoice before recording payments."
                : "Cancelled invoices cannot receive payments."}
            </p>
          </div>
        ) : (
          <PaymentForm
            invoiceId={invoice.id}
            balanceDue={balanceDue}
            currencyCode={currency}
            onPaymentRecorded={loadInvoice}
          />
        )}
      </section>

      {/* Print Styling */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
            color: #111827 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          #invoice-print-area,
          #invoice-print-area * {
            visibility: visible;
          }

          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          tr {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
