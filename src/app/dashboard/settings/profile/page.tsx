
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

import {
  emptyProfile,
  type AgencyProfile,
} from "./components/profile-types";

import { CompanySection } from "./components/company-section";
import { ContactSection } from "./components/contact-section";
import { AddressSection } from "./components/address-section";
import { SocialSection } from "./components/social-section";

const navigation = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "contact", label: "Contact", icon: Building2 },
  { id: "address", label: "Address", icon: MapPin },
  { id: "social", label: "Social Media", icon: Building2 },
];

export default function AgencyProfilePage() {
  const [profile, setProfile] = useState<AgencyProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("company");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load agency profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/agency/profile");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load agency profile.");
        }

        const agency = data.agency;

        setProfile({
          name: agency.name ?? "",
          legalName: agency.legalName ?? "",
          description: agency.description ?? "",
          email: agency.email ?? "",
          phone: agency.phone ?? "",
          website: agency.website ?? "",
          logoUrl: agency.logoUrl ?? "",
          facebookUrl: agency.facebookUrl ?? "",
          instagramUrl: agency.instagramUrl ?? "",
          tiktokUrl: agency.tiktokUrl ?? "",
          linkedinUrl: agency.linkedinUrl ?? "",
          addressLine1: agency.addressLine1 ?? "",
          addressLine2: agency.addressLine2 ?? "",
          city: agency.city ?? "",
          postalCode: agency.postalCode ?? "",
          country: agency.country ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Update form fields
  function updateField(field: keyof AgencyProfile, value: string) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  // Save agency profile
  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/agency/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save profile.");
      }

      setMessage("Your agency profile has been saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  // Navigate to section
  function goToSection(id: string) {
    setActiveSection(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-3 text-sm text-slate-500">
          Loading agency profile...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Page Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
              Workspace Settings / Agency Profile
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Agency Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage your company's information and business details.
            </p>
          </div>

          <ThemeToggle />
        </header>

        {/* Alerts */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Agency Summary */}
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Building2 className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {profile.name || "Your Travel Agency"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profile.email || "Add your business email address"}
            </p>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              {profile.city || "City not added"}
              {profile.country ? `, ${profile.country}` : ""}
            </div>
          </div>
        </section>

        {/* Main Form */}
        <form onSubmit={saveProfile} className="space-y-6">

          {/* Section Navigation */}
          <div className="sticky top-3 z-20 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex min-w-max gap-2">
              {navigation.map((item) => {
                const active = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Independent Sections */}
          <CompanySection
            profile={profile}
            updateField={updateField}
          />

          <ContactSection
            profile={profile}
            updateField={updateField}
          />

          <AddressSection
            profile={profile}
            updateField={updateField}
          />

          <SocialSection
            profile={profile}
            updateField={updateField}
          />

          {/* Save Button */}
          <div className="sticky bottom-4 z-20 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Save your agency information
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your changes will be saved to your agency account.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <footer className="pb-5 text-center text-xs text-slate-400">
          Travel Agency Management System · Agency Settings
        </footer>
      </div>
    </main>
  );
}
