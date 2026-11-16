
"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import PasswordInput from "@/components/password-input";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    agencyName: "",
    businessEmail: "",
    phone: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Step 1: Register user with Better Auth
      const result = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "User registration failed."
        );
      }

      // Step 2: Create agency and OWNER membership
      const agencyResponse = await fetch(
        "/api/agencies/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agencyName: form.agencyName,
            businessEmail: form.businessEmail,
            phone: form.phone,
          }),
        }
      );

      const agencyResult = await agencyResponse.json();

      if (!agencyResponse.ok) {
        throw new Error(
          agencyResult.message || "Agency creation failed."
        );
      }

      setMessage(
        "Your account and agency have been created successfully!"
      );

      setForm({
        name: "",
        email: "",
        password: "",
        agencyName: "",
        businessEmail: "",
        phone: "",
      });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            TRAVEL AGENCY MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Create your agency account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your itineraries and invoices in one place.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Personal Information */}
          <div>
            <h2 className="mb-4 font-semibold text-slate-800">
              Personal information
            </h2>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>

            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
              Email address
            </label>

            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Password with Show / Hide */}
            <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
              Password
            </label>

            <PasswordInput
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
            />
          </div>

          {/* Agency Information */}
          <div className="border-t border-slate-200 pt-5">
            <h2 className="mb-4 font-semibold text-slate-800">
              Agency information
            </h2>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Agency name
            </label>

            <input
              name="agencyName"
              type="text"
              required
              minLength={2}
              value={form.agencyName}
              onChange={handleChange}
              placeholder="Enter your agency name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
              Business email
            </label>

            <input
              name="businessEmail"
              type="email"
              required
              value={form.businessEmail}
              onChange={handleChange}
              placeholder="business@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
              Contact number
            </label>

            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Messages */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create Agency Account"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </main>
  );
}
