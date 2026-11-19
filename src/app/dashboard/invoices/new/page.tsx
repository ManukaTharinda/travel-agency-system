
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
}

interface Itinerary {
  id: string;
  title: string;
  referenceCode: string;
  destination: string;
  customerId: string;
  startDate: string;
  endDate: string;
  customer: {
    firstName: string;
    lastName: string | null;
  };
}

interface FormOptions {
  customers: Customer[];
  itineraries: Itinerary[];
  agency: {
    id: string;
    name: string;
    legalName: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string;
    logoUrl: string | null;
    currencyCode: string;
    invoicePrefix: string;
    nextInvoiceNumber: number;
  };
  billingSettings: {
    bankName: string | null;
    bankBranch: string | null;
    accountName: string | null;
    accountNumber: string | null;
    swiftCode: string | null;
    paymentInstructions: string | null;
    defaultPaymentTerms: string | null;
    defaultTaxRate: number;
    taxRegistrationNumber: string | null;
  };
}

interface InvoiceItem {
  id: string;
  category: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const inputClass =
  "app-input w-full rounded-lg px-3 py-2.5 text-sm outline-none";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-300";

const sectionClass =
  "app-card rounded-xl border border-[#1E293B] p-5 sm:p-6";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "USD",
  }).format(value);
}

function todayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createItem(): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    category: "Travel Service",
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

export default function CreateInvoicePage() {
  const router = useRouter();

  const [options, setOptions] = useState<FormOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [itineraryId, setItineraryId] = useState("");

  const [issueDate, setIssueDate] = useState(todayDate());
  const [dueDate, setDueDate] = useState("");

  const [currencyCode, setCurrencyCode] = useState("LKR");
  const [items, setItems] = useState<InvoiceItem[]>([createItem()]);

  const [discount, setDiscount] = useState("0");
  const [taxRate, setTaxRate] = useState("0");
  const [amountPaid, setAmountPaid] = useState("0");

  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  // Load invoice form information.
  useEffect(() => {
    async function loadOptions() {
      try {
        const response = await fetch("/api/invoices/form-options");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load invoice information.");
        }

        setOptions(data);
        setCurrencyCode(data.agency.currencyCode || "LKR");
        setTaxRate(
          String(data.billingSettings.defaultTaxRate ?? 0)
        );
        setPaymentTerms(
          data.billingSettings.defaultPaymentTerms || ""
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load invoice information."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const selectedCustomer = useMemo(
    () => options?.customers.find((customer) => customer.id === customerId),
    [options, customerId]
  );

  const availableItineraries = useMemo(
    () =>
      options?.itineraries.filter(
        (itinerary) => itinerary.customerId === customerId
      ) ?? [],
    [options, customerId]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity * item.unitPrice,
        0
      ),
    [items]
  );

  const discountAmount = Math.min(
    Math.max(Number(discount) || 0, 0),
    subtotal
  );

  const taxableAmount = Math.max(subtotal - discountAmount, 0);

  const taxAmount =
    (taxableAmount * Math.max(Number(taxRate) || 0, 0)) / 100;

  const totalAmount = taxableAmount + taxAmount;

  const paidAmount = Math.max(Number(amountPaid) || 0, 0);

  const balanceDue = Math.max(totalAmount - paidAmount, 0);

  function updateItem(
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [...current, createItem()]);
  }

  function removeItem(id: string) {
    setItems((current) => {
      if (current.length === 1) return current;
      return current.filter((item) => item.id !== id);
    });
  }

  function handleCustomerChange(value: string) {
    setCustomerId(value);
    setItineraryId("");
  }

  async function handleSubmit(action: "DRAFT" | "ISSUE") {
    setError("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!issueDate) {
      setError("Please select an invoice date.");
      return;
    }

    if (dueDate && dueDate < issueDate) {
      setError("Due date cannot be earlier than the invoice date.");
      return;
    }

    if (items.some((item) => !item.name.trim())) {
      setError("Please enter a name for every invoice item.");
      return;
    }

    if (
      items.some(
        (item) =>
          !Number.isFinite(item.quantity) ||
          item.quantity <= 0 ||
          !Number.isFinite(item.unitPrice) ||
          item.unitPrice < 0
      )
    ) {
      setError("Please check the quantity and unit price of each item.");
      return;
    }

    if (Number(discount) < 0 || Number(discount) > subtotal) {
      setError("Discount cannot exceed the subtotal.");
      return;
    }

    if (Number(taxRate) < 0 || Number(taxRate) > 100) {
      setError("Tax rate must be between 0 and 100.");
      return;
    }

    if (paidAmount > totalAmount) {
      setError("Amount paid cannot exceed the invoice total.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          itineraryId: itineraryId || null,
          issueDate,
          dueDate: dueDate || null,
          currencyCode,
          items: items.map((item) => ({
            category: item.category || null,
            name: item.name.trim(),
            description: item.description.trim() || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          discount: Number(discount) || 0,
          taxRate: Number(taxRate) || 0,
          amountPaid: Number(amountPaid) || 0,
          notes,
          paymentTerms,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice.");
      }

      router.push(`/dashboard/invoices/${data.invoice.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the invoice."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="app-page-container py-12">
        <div className="text-center text-sm text-slate-400">
          Loading invoice generator...
        </div>
      </div>
    );
  }

  if (!options) {
    return (
      <div className="app-page-container py-10">
        <div className={sectionClass}>
          <p className="text-sm text-red-400">
            {error || "Unable to load invoice information."}
          </p>
          <button
            onClick={() => router.back()}
            className="app-button-secondary mt-5 rounded-lg px-4 py-2 text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page-container max-w-6xl space-y-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="mb-3 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Invoices
          </button>

          <h1 className="text-2xl font-semibold text-white">
            Create Invoice
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Generate a professional invoice for your customer.
          </p>
        </div>

        <div className="rounded-lg border border-[#1E293B] bg-[#050914] px-4 py-3">
          <p className="text-xs text-slate-400">Next invoice number</p>
          <p className="mt-1 font-semibold text-white">
            {options.agency.invoicePrefix}-
            {String(options.agency.nextInvoiceNumber).padStart(5, "0")}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Agency Information */}
      <section className={sectionClass}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            {options.agency.logoUrl && (
              <img
                src={options.agency.logoUrl}
                alt="Agency logo"
                className="mb-4 h-12 max-w-36 object-contain"
              />
            )}

            <h2 className="text-lg font-semibold text-white">
              {options.agency.legalName || options.agency.name}
            </h2>

            <div className="mt-2 space-y-1 text-sm text-slate-400">
              {options.agency.address && (
                <p>{options.agency.address}</p>
              )}
              {options.agency.email && (
                <p>{options.agency.email}</p>
              )}
              {options.agency.phone && (
                <p>{options.agency.phone}</p>
              )}
              {options.agency.website && (
                <p>{options.agency.website}</p>
              )}
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Invoice
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {options.agency.name}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Currency: {currencyCode}
            </p>
          </div>
        </div>
      </section>

      {/* Customer and Dates */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-base font-semibold text-white">
          Invoice Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Customer *</label>
            <select
              value={customerId}
              onChange={(event) => handleCustomerChange(event.target.value)}
              className={inputClass}
            >
              <option value="">Select a customer</option>
              {options.customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName || ""}
                  {customer.email ? ` — ${customer.email}` : ""}
                </option>
              ))}
            </select>

            {options.customers.length === 0 && (
              <p className="mt-2 text-xs text-amber-400">
                No active customers found. Add a customer first.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Related Itinerary (Optional)
            </label>
            <select
              value={itineraryId}
              onChange={(event) => setItineraryId(event.target.value)}
              disabled={!customerId}
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">No itinerary selected</option>
              {availableItineraries.map((itinerary) => (
                <option key={itinerary.id} value={itinerary.id}>
                  {itinerary.referenceCode} — {itinerary.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <div className="rounded-lg border border-[#1E293B] bg-[#10192D] p-4 md:col-span-2">
              <p className="text-sm font-medium text-white">
                {selectedCustomer.firstName}{" "}
                {selectedCustomer.lastName || ""}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
                {selectedCustomer.email && (
                  <span>{selectedCustomer.email}</span>
                )}
                {selectedCustomer.phone && (
                  <span>{selectedCustomer.phone}</span>
                )}
                {selectedCustomer.nationality && (
                  <span>{selectedCustomer.nationality}</span>
                )}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Invoice Date *</label>
            <input
              type="date"
              value={issueDate}
              onChange={(event) => setIssueDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              min={issueDate}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Currency</label>
            <select
              value={currencyCode}
              onChange={(event) => setCurrencyCode(event.target.value)}
              className={inputClass}
            >
              <option value="LKR">LKR - Sri Lankan Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
        </div>
      </section>

      {/* Invoice Items */}
      <section className={sectionClass}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Invoice Items
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Add travel services, accommodation, transport and other charges.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="app-button-secondary rounded-lg px-3 py-2 text-sm"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg border border-[#1E293B] bg-[#080F1E] p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  Item {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="text-xs text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={item.category}
                    onChange={(event) =>
                      updateItem(item.id, "category", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option>Travel Service</option>
                    <option>Accommodation</option>
                    <option>Transportation</option>
                    <option>Safari</option>
                    <option>Activities</option>
                    <option>Meals</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Item Name *</label>
                  <input
                    value={item.name}
                    onChange={(event) =>
                      updateItem(item.id, "name", event.target.value)
                    }
                    placeholder="e.g. Airport transfer"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <input
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, "description", event.target.value)
                    }
                    placeholder="Additional details about this service"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Quantity</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "quantity",
                        Number(event.target.value)
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "unitPrice",
                        Number(event.target.value)
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between rounded-lg bg-[#10192D] px-4 py-3">
                    <span className="text-sm text-slate-400">
                      Item Total
                    </span>
                    <span className="font-semibold text-white">
                      {formatMoney(
                        item.quantity * item.unitPrice,
                        currencyCode
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Summary */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-base font-semibold text-white">
          Payment Summary
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Discount Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(event) => setTaxRate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Amount Already Paid</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Payment Terms</label>
            <input
              value={paymentTerms}
              onChange={(event) => setPaymentTerms(event.target.value)}
              placeholder="e.g. Payment due within 7 days"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#1E293B] bg-[#080F1E] p-5">
          <div className="ml-auto max-w-md space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white">
                {formatMoney(subtotal, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Discount</span>
              <span className="text-red-400">
                - {formatMoney(discountAmount, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400">
                Tax ({Number(taxRate) || 0}%)
              </span>
              <span className="text-white">
                {formatMoney(taxAmount, currencyCode)}
              </span>
            </div>

            <div className="border-t border-[#1E293B] pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-white">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-blue-400">
                  {formatMoney(totalAmount, currencyCode)}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount Paid</span>
              <span className="text-emerald-400">
                {formatMoney(paidAmount, currencyCode)}
              </span>
            </div>

            <div className="flex justify-between rounded-lg bg-blue-500/10 px-4 py-3">
              <span className="font-semibold text-white">Balance Due</span>
              <span className="font-bold text-blue-400">
                {formatMoney(balanceDue, currencyCode)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className={sectionClass}>
        <h2 className="mb-5 text-base font-semibold text-white">
          Additional Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Invoice Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add any additional information for your customer..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Payment Instructions</label>
            <div className="rounded-lg border border-[#1E293B] bg-[#10192D] p-4">
              <p className="text-xs text-slate-400">
                {options.billingSettings.bankName || "Bank details not configured"}
              </p>

              {options.billingSettings.bankBranch && (
                <p className="mt-1 text-sm text-slate-300">
                  Branch: {options.billingSettings.bankBranch}
                </p>
              )}

              {options.billingSettings.accountName && (
                <p className="mt-1 text-sm text-slate-300">
                  Account Name: {options.billingSettings.accountName}
                </p>
              )}

              {options.billingSettings.accountNumber && (
                <p className="mt-1 text-sm text-slate-300">
                  Account Number: {options.billingSettings.accountNumber}
                </p>
              )}

              {options.billingSettings.swiftCode && (
                <p className="mt-1 text-sm text-slate-300">
                  SWIFT: {options.billingSettings.swiftCode}
                </p>
              )}

              {options.billingSettings.paymentInstructions && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-400">
                  {options.billingSettings.paymentInstructions}
                </p>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              These details are copied from your agency billing settings.
            </p>
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#1E293B] pt-5 sm:flex-row">
        <button
          type="button"
          disabled={saving}
          onClick={() => router.push("/dashboard/invoices")}
          className="app-button-secondary rounded-lg px-5 py-3 text-sm"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving || !customerId || options.customers.length === 0}
          onClick={() => handleSubmit("DRAFT")}
          className="app-button-secondary rounded-lg px-5 py-3 text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save as Draft"}
        </button>

        <button
          type="button"
          disabled={saving || !customerId || options.customers.length === 0}
          onClick={() => handleSubmit("ISSUE")}
          className="app-button-primary rounded-lg px-6 py-3 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Processing..." : "Issue Invoice"}
        </button>
      </div>
    </div>
  );
}
