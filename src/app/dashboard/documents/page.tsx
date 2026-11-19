
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  Receipt,
} from "lucide-react";

import DocumentTypeSwitcher from "./components/document-type-switcher";

import QuotationCustomerSection from "./components/quotation-customer-section";
import QuotationItemsSection from "./components/quotation-items-section";
import QuotationFinancialSection from "./components/quotation-financial-section";
import QuotationFormActions from "./components/quotation-form-actions";
import QuotationPreviewSection from "./components/quotation-preview-section";

import InvoiceCustomerSection from "./components/invoice-customer-section";
import InvoiceItemsSection from "./components/invoice-items-section";
import InvoiceFinancialSection from "./components/invoice-financial-section";
import InvoicePreviewSection from "./components/invoice-preview-section";
import InvoiceFormActions from "./components/invoice-form-actions";

import {
  defaultDocumentLineItem,
  type DocumentCustomer,
  type DocumentItinerary,
  type DocumentLineItem,
  type DocumentType,
  type QuotationRecord,
} from "./components/document-types";

interface FormOptionsResponse {
  customers: DocumentCustomer[];
  itineraries: DocumentItinerary[];
}

interface ApiErrorResponse {
  error?: string;
}

interface AgencyProfile {
  name?: string;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

interface BillingSettings {
  bankName?: string | null;
  bankBranch?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  swiftCode?: string | null;
  paymentInstructions?: string | null;
  defaultPaymentTerms?: string | null;
  defaultTaxRate?: string | number | null;
}

interface QuotationDetail {
  id: string;
  quotationNumber: string;
  status: string;
  customerId: string;
  sourceItineraryId: string | null;
  issueDate: string;
  validUntil: string;
  currencyCode: string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  totalAmount: number | string;
  notes: string | null;
  termsAndConditions: string | null;
  items: Array<{
    id: string;
    category: string | null;
    name: string;
    description: string | null;
    quantity: number | string;
    unitPrice: number | string;
    lineTotal: number | string;
  }>;
}

function inputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatInputDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function getDefaultValidUntil(issueDate: string) {
  const date = new Date(`${issueDate}T00:00:00`);
  date.setDate(date.getDate() + 14);

  return inputDate(date);
}

export default function DocumentsPage() {
  const [documentType, setDocumentType] =
    useState<DocumentType>("quotation");

  // Shared agency data
  const [customers, setCustomers] = useState<DocumentCustomer[]>([]);
  const [itineraries, setItineraries] = useState<DocumentItinerary[]>([]);
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);

  const [agencyProfile, setAgencyProfile] =
    useState<AgencyProfile | null>(null);

  const [billingSettings, setBillingSettings] =
    useState<BillingSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // QUOTATION FORM STATE
  // --------------------------------------------------

  const [customerId, setCustomerId] = useState("");
  const [itineraryId, setItineraryId] = useState("");

 const [issueDate, setIssueDate] = useState("");

const [validUntil, setValidUntil] = useState("");

  const [currencyCode, setCurrencyCode] = useState("LKR");

  const [items, setItems] = useState<DocumentLineItem[]>([
    defaultDocumentLineItem(),
  ]);

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  // --------------------------------------------------
  // INVOICE FORM STATE
  // --------------------------------------------------

  const [invoiceCustomerId, setInvoiceCustomerId] = useState("");
  const [invoiceQuotationId, setInvoiceQuotationId] =
    useState<string | null>(null);

  const [invoiceItineraryId, setInvoiceItineraryId] =
    useState<string | null>(null);

const [invoiceIssueDate, setInvoiceIssueDate] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");

  const [invoiceCurrencyCode, setInvoiceCurrencyCode] =
    useState("LKR");

  const [invoiceItems, setInvoiceItems] = useState<DocumentLineItem[]>([
    defaultDocumentLineItem(),
  ]);

  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceTaxRate, setInvoiceTaxRate] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  // --------------------------------------------------
  // LOAD FORM DATA
  // --------------------------------------------------

  const loadFormOptions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [
        optionsResponse,
        quotationsResponse,
        profileResponse,
        billingResponse,
      ] = await Promise.all([
        fetch("/api/quotations/form-options", {
          cache: "no-store",
        }),

        fetch("/api/quotations?status=CONFIRMED", {
          cache: "no-store",
        }),

        fetch("/api/agency/profile", {
          cache: "no-store",
        }),

        fetch("/api/agency/billing-settings", {
          cache: "no-store",
        }),
      ]);

      const optionsData = await optionsResponse.json();
      const quotationsData = await quotationsResponse.json();

      if (!optionsResponse.ok) {
        throw new Error(
          optionsData.error || "Unable to load agency data."
        );
      }

      if (!quotationsResponse.ok) {
        throw new Error(
          quotationsData.error || "Unable to load confirmed quotations."
        );
      }

      const options = optionsData as FormOptionsResponse;

      setCustomers(options.customers ?? []);
      setItineraries(options.itineraries ?? []);

      const quotationRecords = (quotationsData.quotations ?? []).map(
        (quotation: QuotationRecord) => ({
          ...quotation,
          totalAmount: Number(quotation.totalAmount),
        })
      );

      setQuotations(quotationRecords);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();

        setAgencyProfile(profileData.agency ?? null);
      }

      if (billingResponse.ok) {
        const billingData = await billingResponse.json();

        const settings: BillingSettings =
          billingData.settings ?? {};

        setBillingSettings(settings);

        setInvoiceTaxRate((current) =>
          current === 0
            ? Number(settings.defaultTaxRate ?? 0)
            : current
        );

        setPaymentTerms((current) =>
          current || settings.defaultPaymentTerms || ""
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load document data."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFormOptions();
  }, [loadFormOptions]);

  // Initialize document dates after the page mounts in the browser.
  useEffect(() => {
    const today = inputDate(new Date());

    setIssueDate(today);
    setValidUntil(getDefaultValidUntil(today));
    setInvoiceIssueDate(today);
  }, []);

  // --------------------------------------------------
  // QUOTATION CALCULATIONS
  // --------------------------------------------------

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === customerId),
    [customers, customerId]
  );

  const selectedItinerary = useMemo(
    () => itineraries.find((itinerary) => itinerary.id === itineraryId),
    [itineraries, itineraryId]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.lineTotal, 0),
    [items]
  );

  // --------------------------------------------------
  // INVOICE CALCULATIONS
  // --------------------------------------------------

  const selectedInvoiceCustomer = useMemo(
    () =>
      customers.find(
        (customer) => customer.id === invoiceCustomerId
      ),
    [customers, invoiceCustomerId]
  );

  const selectedInvoiceItinerary = useMemo(
    () =>
      itineraries.find(
        (itinerary) => itinerary.id === invoiceItineraryId
      ),
    [itineraries, invoiceItineraryId]
  );

  const invoiceSubtotal = useMemo(
    () =>
      invoiceItems.reduce(
        (total, item) => total + item.lineTotal,
        0
      ),
    [invoiceItems]
  );

  const agencyAddress = [
    agencyProfile?.addressLine1,
    agencyProfile?.addressLine2,
    agencyProfile?.city,
    agencyProfile?.postalCode,
    agencyProfile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  // --------------------------------------------------
  // RESET QUOTATION FORM
  // --------------------------------------------------

  const resetForm = () => {
    const today = inputDate(new Date());

    setCustomerId("");
    setItineraryId("");
    setIssueDate(today);
    setValidUntil(getDefaultValidUntil(today));
    setCurrencyCode("LKR");

    setItems([defaultDocumentLineItem()]);

    setDiscount(0);
    setTaxRate(0);
    setNotes("");
    setTerms("");

    setError("");
    setSuccess("");
  };

  const handleCustomerChange = (value: string) => {
    setCustomerId(value);
    setItineraryId("");
  };

  const handleIssueDateChange = (value: string) => {
    setIssueDate(value);

    if (value && (!validUntil || validUntil < value)) {
      setValidUntil(getDefaultValidUntil(value));
    }
  };

  // --------------------------------------------------
  // SAVE QUOTATION
  // --------------------------------------------------

  const handleSaveDraft = async () => {
    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!issueDate || !validUntil || validUntil < issueDate) {
      setError("Please provide valid quotation dates.");
      return;
    }

    if (
      items.length === 0 ||
      items.some(
        (item) =>
          !item.name.trim() ||
          !Number.isFinite(item.quantity) ||
          !Number.isFinite(item.unitPrice) ||
          item.quantity <= 0 ||
          item.unitPrice < 0
      )
    ) {
      setError("Please check your quotation items and prices.");
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > subtotal
    ) {
      setError("Discount cannot exceed the subtotal.");
      return;
    }

    if (
      !Number.isFinite(taxRate) ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      setError("Please enter a valid tax rate.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          itineraryId: itineraryId || null,
          issueDate,
          validUntil,
          currencyCode,
          items: items.map((item) => ({
            category: item.category,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          discount,
          taxRate,
          notes,
          terms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiErrorResponse).error ||
            "Unable to save quotation."
        );
      }

      setSuccess(
        `Quotation ${data.quotation.quotationNumber} saved successfully as a draft.`
      );

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndSend = () => {
    setError(
      "Email delivery is not available yet. Save the quotation as a draft for now."
    );
  };

  // --------------------------------------------------
  // RESET INVOICE FORM
  // --------------------------------------------------

  const resetInvoiceForm = () => {
    const today = inputDate(new Date());

    setInvoiceCustomerId("");
    setInvoiceQuotationId(null);
    setInvoiceItineraryId(null);

    setInvoiceIssueDate(today);
    setInvoiceDueDate("");

    setInvoiceCurrencyCode("LKR");

    setInvoiceItems([defaultDocumentLineItem()]);

    setInvoiceDiscount(0);
    setInvoiceTaxRate(
      Number(billingSettings?.defaultTaxRate ?? 0)
    );

    setAmountPaid(0);
    setInvoiceNotes("");
    setPaymentTerms(
      billingSettings?.defaultPaymentTerms ?? ""
    );

    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // INVOICE CUSTOMER CHANGE
  // --------------------------------------------------

  const handleInvoiceCustomerChange = (value: string) => {
    setInvoiceCustomerId(value);
    setInvoiceQuotationId(null);
    setInvoiceItineraryId(null);
  };

  // --------------------------------------------------
  // LOAD CONFIRMED QUOTATION DETAILS
  // --------------------------------------------------

  const handleInvoiceQuotationChange = async (value: string) => {
    setError("");
    setSuccess("");

    if (!value) {
      setInvoiceQuotationId(null);
      return;
    }

    setInvoiceQuotationId(value);

    try {
      const response = await fetch(
        `/api/quotations/${encodeURIComponent(value)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load quotation details."
        );
      }

      if (data.alreadyConverted) {
        throw new Error(
          `This quotation has already been converted into invoice ${data.existingInvoice?.invoiceNumber ?? ""}.`
        );
      }

      const quotation = data.quotation as QuotationDetail;

      if (quotation.status !== "CONFIRMED") {
        throw new Error(
          "Only confirmed quotations can be converted."
        );
      }

      const quotationSubtotal = Number(quotation.subtotal);
      const quotationDiscount = Number(quotation.discount);
      const quotationTax = Number(quotation.tax);

      const taxableAmount = Math.max(
        0,
        quotationSubtotal - quotationDiscount
      );

      const quotationTaxRate =
        taxableAmount > 0
          ? (quotationTax / taxableAmount) * 100
          : 0;

      setInvoiceCustomerId(quotation.customerId);

      setInvoiceItineraryId(
        quotation.sourceItineraryId ?? null
      );

      setInvoiceIssueDate(
        formatInputDate(quotation.issueDate)
      );

      setInvoiceCurrencyCode(quotation.currencyCode);

      setInvoiceItems(
        quotation.items.map((item) => ({
          id: item.id,
          category: item.category ?? "OTHER",
          name: item.name,
          description: item.description ?? "",
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
        }))
      );

      setInvoiceDiscount(quotationDiscount);
      setInvoiceTaxRate(quotationTaxRate);

      setAmountPaid(0);
      setInvoiceNotes(quotation.notes ?? "");

      setPaymentTerms(
        quotation.termsAndConditions ??
          billingSettings?.defaultPaymentTerms ??
          ""
      );

      setSuccess(
        `Quotation ${quotation.quotationNumber} loaded successfully. Review the invoice details before saving.`
      );
    } catch (err) {
      setInvoiceQuotationId(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load quotation."
      );
    }
  };

  // --------------------------------------------------
  // INVOICE ISSUE DATE CHANGE
  // --------------------------------------------------

  const handleInvoiceIssueDateChange = (value: string) => {
    setInvoiceIssueDate(value);

    if (invoiceDueDate && value && invoiceDueDate < value) {
      setInvoiceDueDate("");
    }
  };

  // --------------------------------------------------
  // SAVE INVOICE
  // --------------------------------------------------

  const handleSaveInvoice = async (
    action: "DRAFT" | "ISSUE"
  ) => {
    setError("");
    setSuccess("");

    if (!invoiceCustomerId && !invoiceQuotationId) {
      setError("Please select a customer or confirmed quotation.");
      return;
    }

    if (!invoiceIssueDate) {
      setError("Please provide an invoice issue date.");
      return;
    }

    if (
      invoiceDueDate &&
      invoiceDueDate < invoiceIssueDate
    ) {
      setError("Payment due date cannot be before the issue date.");
      return;
    }

    if (
      invoiceItems.length === 0 ||
      invoiceItems.some(
        (item) =>
          !item.name.trim() ||
          !Number.isFinite(item.quantity) ||
          !Number.isFinite(item.unitPrice) ||
          item.quantity <= 0 ||
          item.unitPrice < 0
      )
    ) {
      setError("Please check your invoice items and prices.");
      return;
    }

    if (
      !Number.isFinite(invoiceDiscount) ||
      invoiceDiscount < 0 ||
      invoiceDiscount > invoiceSubtotal
    ) {
      setError("Discount cannot exceed the invoice subtotal.");
      return;
    }

    if (
      !Number.isFinite(invoiceTaxRate) ||
      invoiceTaxRate < 0 ||
      invoiceTaxRate > 100
    ) {
      setError("Please enter a valid tax rate.");
      return;
    }

    const taxableAmount = Math.max(
      0,
      invoiceSubtotal - invoiceDiscount
    );

    const calculatedTotal =
      taxableAmount +
      (taxableAmount * invoiceTaxRate) / 100;

    if (
      !Number.isFinite(amountPaid) ||
      amountPaid < 0 ||
      amountPaid > calculatedTotal
    ) {
      setError("Amount paid cannot exceed the invoice total.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: invoiceCustomerId || undefined,
          quotationId: invoiceQuotationId,
          itineraryId: invoiceItineraryId,
          issueDate: invoiceIssueDate,
          dueDate: invoiceDueDate || null,
          currencyCode: invoiceCurrencyCode,

          items: invoiceItems.map((item) => ({
            category: item.category,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),

          discount: invoiceDiscount,
          taxRate: invoiceTaxRate,
          amountPaid,
          notes: invoiceNotes,
          paymentTerms,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiErrorResponse).error ||
            "Unable to save invoice."
        );
      }

      const invoiceNumber = data.invoice.invoiceNumber;

      setSuccess(
        action === "DRAFT"
          ? `Invoice ${invoiceNumber} saved successfully as a draft.`
          : `Invoice ${invoiceNumber} saved successfully.`
      );

      resetInvoiceForm();

      // Refresh confirmed quotations so converted quotations
      // can no longer be selected.
      void loadFormOptions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the invoice."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="mx-auto w-full max-w-[1320px] space-y-5 px-3 pb-8 sm:px-5 lg:px-6">

      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
            <FileText size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Document Generator
              </h1>

              <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                V1
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Create and manage your travel documents.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadFormOptions}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
        >
          <RefreshCw
            size={14}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </header>

      {/* Document Switcher */}
      <div className="max-w-[460px]">
        <DocumentTypeSwitcher
          value={documentType}
          onChange={(value) => {
            setDocumentType(value);
            setError("");
            setSuccess("");
          }}
        />
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          {success}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" />
            Loading your agency data...
          </div>
        </div>
      ) : documentType === "quotation" ? (

        /* ==========================================
           QUOTATION WORKSPACE
        ========================================== */
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500" />

                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Create New Quotation
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Complete the details and review your document.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={isSaving}
              className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Reset Form
            </button>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">

            {/* Left: Quotation Form */}
            <div className="min-w-0 space-y-4">
              <QuotationCustomerSection
                customers={customers}
                itineraries={itineraries}
                customerId={customerId}
                itineraryId={itineraryId}
                issueDate={issueDate}
                validUntil={validUntil}
                onCustomerChange={handleCustomerChange}
                onItineraryChange={setItineraryId}
                onIssueDateChange={handleIssueDateChange}
                onValidUntilChange={setValidUntil}
              />

              <QuotationItemsSection
                items={items}
                currencyCode={currencyCode}
                onChange={setItems}
              />

              <QuotationFinancialSection
                currencyCode={currencyCode}
                discount={discount}
                taxRate={taxRate}
                notes={notes}
                terms={terms}
                subtotal={subtotal}
                onCurrencyChange={setCurrencyCode}
                onDiscountChange={setDiscount}
                onTaxRateChange={setTaxRate}
                onNotesChange={setNotes}
                onTermsChange={setTerms}
              />
            </div>

            {/* Right: Quotation Preview */}
            <aside className="min-w-0 xl:sticky xl:top-5">
              <QuotationPreviewSection
                customer={selectedCustomer}
                itinerary={selectedItinerary}
                issueDate={issueDate}
                validUntil={validUntil}
                currencyCode={currencyCode}
                items={items}
                discount={discount}
                taxRate={taxRate}
                notes={notes}
                terms={terms}
              />

              <div className="mt-3 rounded-xl border border-blue-200/70 bg-blue-50/60 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
                <div className="flex items-start gap-2">
                  <Sparkles
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  />

                  <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
                    Your preview updates as you change customer details,
                    services and financial information.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <QuotationFormActions
            isSaving={isSaving}
            onSaveDraft={handleSaveDraft}
            onSaveAndSend={handleSaveAndSend}
            onCancel={resetForm}
          />
        </>

      ) : (

        /* ==========================================
           INVOICE WORKSPACE
        ========================================== */
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Receipt size={17} className="text-blue-500" />

                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Create New Invoice
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Create an invoice or convert a confirmed quotation.
              </p>
            </div>

            <button
              type="button"
              onClick={resetInvoiceForm}
              disabled={isSaving}
              className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Reset Form
            </button>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">

            {/* Left: Invoice Form */}
            <div className="min-w-0 space-y-4">
              <InvoiceCustomerSection
                customers={customers}
                itineraries={itineraries}
                quotations={quotations}
                customerId={invoiceCustomerId}
                quotationId={invoiceQuotationId}
                itineraryId={invoiceItineraryId}
                issueDate={invoiceIssueDate}
                dueDate={invoiceDueDate}
                onCustomerChange={handleInvoiceCustomerChange}
                onQuotationChange={handleInvoiceQuotationChange}
                onItineraryChange={setInvoiceItineraryId}
                onIssueDateChange={handleInvoiceIssueDateChange}
                onDueDateChange={setInvoiceDueDate}
              />

              <InvoiceItemsSection
                items={invoiceItems}
                currencyCode={invoiceCurrencyCode}
                onChange={setInvoiceItems}
              />

              <InvoiceFinancialSection
                currencyCode={invoiceCurrencyCode}
                discount={invoiceDiscount}
                taxRate={invoiceTaxRate}
                amountPaid={amountPaid}
                notes={invoiceNotes}
                paymentTerms={paymentTerms}
                subtotal={invoiceSubtotal}
                onCurrencyChange={setInvoiceCurrencyCode}
                onDiscountChange={setInvoiceDiscount}
                onTaxRateChange={setInvoiceTaxRate}
                onAmountPaidChange={setAmountPaid}
                onNotesChange={setInvoiceNotes}
                onPaymentTermsChange={setPaymentTerms}
              />
            </div>

            {/* Right: Invoice Preview */}
            <aside className="min-w-0 xl:sticky xl:top-5">
              <InvoicePreviewSection
                customer={selectedInvoiceCustomer}
                itinerary={selectedInvoiceItinerary}
                issueDate={invoiceIssueDate}
                dueDate={invoiceDueDate}
                currencyCode={invoiceCurrencyCode}
                items={invoiceItems}
                discount={invoiceDiscount}
                taxRate={invoiceTaxRate}
                amountPaid={amountPaid}
                notes={invoiceNotes}
                paymentTerms={paymentTerms}
                agencyName={agencyProfile?.name}
                agencyEmail={agencyProfile?.email ?? undefined}
                agencyPhone={agencyProfile?.phone ?? undefined}
                agencyAddress={agencyAddress}
                agencyLogoUrl={agencyProfile?.logoUrl ?? undefined}
                bankName={billingSettings?.bankName ?? undefined}
                bankBranch={billingSettings?.bankBranch ?? undefined}
                accountName={billingSettings?.accountName ?? undefined}
                accountNumber={billingSettings?.accountNumber ?? undefined}
                swiftCode={billingSettings?.swiftCode ?? undefined}
                paymentInstructions={
                  billingSettings?.paymentInstructions ?? undefined
                }
              />

              <div className="mt-3 rounded-xl border border-blue-200/70 bg-blue-50/60 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
                <div className="flex items-start gap-2">
                  <Sparkles
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  />

                  <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
                    Your invoice preview includes your agency profile and
                    configured payment details. Review everything before
                    saving the invoice.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Invoice Actions */}
          <InvoiceFormActions
            isSaving={isSaving}
            onSaveDraft={() => handleSaveInvoice("DRAFT")}
            onSaveInvoice={() => handleSaveInvoice("ISSUE")}
            onCancel={resetInvoiceForm}
          />
        </>
      )}
    </main>
  );
}
