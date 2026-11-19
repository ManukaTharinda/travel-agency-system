
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Phone,
  Globe,
  StickyNote,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  notes: string;
}

const INITIAL_FORM: CustomerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "",
  notes: "",
};

export default function NewCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState<CustomerForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    field: keyof CustomerForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      return "Please enter the customer's first name.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          nationality: form.nationality.trim(),
          notes: form.notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create customer."
        );
      }

      router.push("/dashboard/customers");
      router.refresh();
    } catch (err) {
      console.error("Create customer error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the customer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-[#1E293B] bg-[#10192D] px-3 text-sm text-[#F8FAFC] outline-none transition-colors placeholder:text-[#64748B] focus:border-[#1760F5] focus:ring-2 focus:ring-[#1760F5]/10";

  const textareaClass =
    "w-full resize-y rounded-lg border border-[#1E293B] bg-[#10192D] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition-colors placeholder:text-[#64748B] focus:border-[#1760F5] focus:ring-2 focus:ring-[#1760F5]/10";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-10">

      {/* Header */}
      <div>
        <Link
          href="/dashboard/customers"
          className="mb-3 inline-flex items-center gap-2 text-xs text-[#94A3B8] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Customers
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">
              Add New Customer
            </h1>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Register a customer for your travel agency.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Personal Information */}
        <section className="rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:p-5">
          <div className="mb-5 flex items-center gap-2.5">
            <User className="h-4 w-4 text-blue-400" />

            <h2 className="text-sm font-semibold text-[#F8FAFC]">
              Personal Information
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label htmlFor="firstName" className="mb-2 block text-xs font-medium text-[#CBD5E1]">
                First Name <span className="text-rose-400">*</span>
              </label>

              <input
                id="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-2 block text-xs font-medium text-[#CBD5E1]">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 flex items-center gap-2 text-xs font-medium text-[#CBD5E1]">
                <Mail className="h-3.5 w-3.5 text-[#64748B]" />
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="customer@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 flex items-center gap-2 text-xs font-medium text-[#CBD5E1]">
                <Phone className="h-3.5 w-3.5 text-[#64748B]" />
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+94 77 123 4567"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="nationality" className="mb-2 flex items-center gap-2 text-xs font-medium text-[#CBD5E1]">
                <Globe className="h-3.5 w-3.5 text-[#64748B]" />
                Nationality
              </label>

              <input
                id="nationality"
                type="text"
                value={form.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="e.g. United Kingdom"
                className={inputClass}
              />
            </div>

          </div>
        </section>

        {/* Additional Notes */}
        <section className="rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <StickyNote className="h-4 w-4 text-amber-400" />

            <h2 className="text-sm font-semibold text-[#F8FAFC]">
              Additional Notes
            </h2>
          </div>

          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={4}
            placeholder="Add customer preferences, special requirements, or other useful information..."
            className={textareaClass}
          />
        </section>

        {/* Actions */}
        <section className="flex flex-col-reverse gap-3 rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/customers"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#1E293B] bg-[#10192D] px-5 text-sm font-medium text-[#CBD5E1] transition-colors hover:bg-[#17243B]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1760F5] px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Customer...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Customer
              </>
            )}
          </button>
        </section>

      </form>
    </div>
  );
}
