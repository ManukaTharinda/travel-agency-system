
"use client";

import { useEffect, useState } from "react";
import {
  Receipt,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

import {
  defaultBillingSettings,
  type BillingSettings,
  type DocumentType,
} from "./components/billing-types";

import { InvoiceConfigurationSection } from "./components/invoice-configuration-section";
import { BankPaymentSection } from "./components/bank-payment-section";
import { QuotationSection } from "./components/quotation-section";
import { BillingPreviewSection } from "./components/billing-preview-section";

export default function BillingSettingsPage() {
  const [settings, setSettings] = useState<BillingSettings>(
    defaultBillingSettings
  );

  const [activeDocument, setActiveDocument] =
    useState<DocumentType>("invoice");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load billing settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/agency/billing-settings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load billing settings."
          );
        }

        const savedSettings = data.settings ?? data;

        setSettings({
          ...defaultBillingSettings,
          bankName: savedSettings.bankName ?? "",
          bankBranch: savedSettings.bankBranch ?? "",
          accountName: savedSettings.accountName ?? "",
          accountNumber: savedSettings.accountNumber ?? "",
          swiftCode: savedSettings.swiftCode ?? "",
          paymentInstructions:
            savedSettings.paymentInstructions ?? "",
          defaultPaymentTerms:
            savedSettings.defaultPaymentTerms ??
            defaultBillingSettings.defaultPaymentTerms,
          defaultTaxRate: String(
            savedSettings.defaultTaxRate ??
              defaultBillingSettings.defaultTaxRate
          ),
          taxRegistrationNumber:
            savedSettings.taxRegistrationNumber ?? "",
          quotationValidityDays:
            savedSettings.quotationValidityDays ??
            defaultBillingSettings.quotationValidityDays,
          quotationTerms: savedSettings.quotationTerms ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load billing settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Update individual settings
  function updateField(
    field: keyof BillingSettings,
    value: string | number
  ) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  // Save billing settings
  async function saveSettings() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (
        !Number.isInteger(settings.quotationValidityDays) ||
        settings.quotationValidityDays < 1 ||
        settings.quotationValidityDays > 365
      ) {
        throw new Error(
          "Quotation validity must be between 1 and 365 whole days."
        );
      }

      const response = await fetch(
        "/api/agency/billing-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save billing settings."
        );
      }

      setMessage(
        "Your billing and quotation settings have been saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-[#080D19]">
        <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-6 py-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />

          <span className="text-sm text-slate-600 dark:text-slate-300">
            Loading billing settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-7 pb-32 dark:bg-[#080D19] sm:px-6 lg:px-8">

      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[110px] dark:bg-blue-500/10" />

        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-400/10 blur-[110px] dark:bg-violet-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">

        {/* Page Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />

              Workspace Settings

              <span className="text-slate-400">/</span>

              Billing & Documents
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Billing Configuration
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage invoice payment details, quotation validity
              and document terms for your travel agency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="
                inline-flex items-center gap-2 rounded-xl
                bg-blue-600 px-5 py-3 text-sm font-semibold text-white
                shadow-lg shadow-blue-600/20
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-blue-700
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </header>

        {/* Success Message */}
        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 backdrop-blur-xl dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 backdrop-blur-xl dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Document Type Selector */}
        <section
          className="
            rounded-2xl border border-white/70
            bg-white/75 p-2 shadow-lg shadow-slate-200/20
            backdrop-blur-2xl
            dark:border-white/10 dark:bg-slate-900/75
            dark:shadow-black/20
          "
        >
          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() => {
                setActiveDocument("invoice");
                setMessage("");
                setError("");
              }}
              className={`
                flex items-center justify-center gap-3
                rounded-xl px-4 py-4 text-sm font-semibold
                transition-all duration-200
                ${
                  activeDocument === "invoice"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                }
              `}
            >
              <Receipt className="h-5 w-5" />

              Invoice Settings
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveDocument("quotation");
                setMessage("");
                setError("");
              }}
              className={`
                flex items-center justify-center gap-3
                rounded-xl px-4 py-4 text-sm font-semibold
                transition-all duration-200
                ${
                  activeDocument === "quotation"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                }
              `}
            >
              <FileText className="h-5 w-5" />

              Quotation Settings
            </button>
          </div>
        </section>

        {/* Document Description */}
        <div className="flex items-start gap-3 px-1">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            {activeDocument === "invoice" ? (
              <Receipt className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {activeDocument === "invoice"
                ? "Invoice Configuration"
                : "Quotation Configuration"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeDocument === "invoice"
                ? "Configure payment information, tax details and default invoice terms."
                : "Configure quotation validity, customer acceptance conditions and quotation terms."}
            </p>
          </div>
        </div>

        {/* Main Settings Layout */}
        <div className="grid items-start gap-7 lg:grid-cols-[1fr_0.95fr]">

          {/* Left: Settings */}
          <div className="space-y-7">

            {activeDocument === "invoice" ? (
              <>
                <InvoiceConfigurationSection
                  settings={settings}
                  updateField={updateField}
                />

                <BankPaymentSection
                  settings={settings}
                  updateField={updateField}
                />
              </>
            ) : (
              <QuotationSection
                settings={settings}
                updateField={updateField}
              />
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-5 lg:sticky lg:top-6">
            <BillingPreviewSection
              settings={settings}
              documentType={activeDocument}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div
        className="
          fixed bottom-0 left-0 right-0 z-30
          border-t border-slate-200/80
          bg-white/85 px-4 py-4
          shadow-[0_-8px_30px_rgba(15,23,42,0.06)]
          backdrop-blur-2xl
          dark:border-white/10 dark:bg-slate-950/85
          dark:shadow-black/20
          sm:px-6 lg:px-8
        "
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Unsaved changes?
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Save your billing configuration to apply the changes.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-blue-600 px-6 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-blue-600/20
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-blue-700
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving Settings..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </main>
  );
}
