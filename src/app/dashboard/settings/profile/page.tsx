
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Globe,
  Share2,
  ArrowUpRight,
  Settings2,
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
  { id: "contact", label: "Contact", icon: Phone },
  { id: "address", label: "Address", icon: MapPin },
  { id: "social", label: "Social Media", icon: Share2 },
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

  // Loading screen
  if (loading) {
    return (
      <main className="
        flex min-h-screen items-center justify-center
        bg-slate-50 dark:bg-slate-950
      ">
        <div className="
          flex flex-col items-center gap-4 rounded-2xl
          border border-slate-200 bg-white/80 px-10 py-8
          shadow-sm backdrop-blur-xl
          dark:border-white/10 dark:bg-slate-900/80
        ">
          <div className="
            flex h-12 w-12 items-center justify-center
            rounded-2xl bg-blue-50 text-blue-600
            dark:bg-blue-500/10 dark:text-blue-400
          ">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Loading Agency Profile
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Please wait while we retrieve your information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="
      min-h-screen bg-slate-50
      px-4 py-6 transition-colors duration-300
      dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8
    ">
      <div className="mx-auto max-w-5xl space-y-7">

        {/* Page Header */}
        <header className="
          flex flex-col justify-between gap-5
          sm:flex-row sm:items-center
        ">
          <div>
            <div className="
              mb-3 inline-flex items-center gap-2
              rounded-full border border-blue-100
              bg-blue-50/80 px-3 py-1.5
              text-xs font-semibold text-blue-700
              dark:border-blue-400/20 dark:bg-blue-500/10
              dark:text-blue-400
            ">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace Settings
              <span className="text-blue-300 dark:text-blue-500">/</span>
              Agency Profile
            </div>

            <h1 className="
              text-3xl font-bold tracking-tight
              text-slate-900 dark:text-white sm:text-4xl
            ">
              Agency Profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage your company's identity, business information
              and online presence from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="
              hidden items-center gap-2 rounded-xl
              border border-slate-200 bg-white/80
              px-3 py-2 text-xs text-slate-500
              dark:border-white/10 dark:bg-slate-900/80
              dark:text-slate-400 sm:flex
            ">
              <Settings2 className="h-4 w-4" />
              Profile Settings
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Alerts */}
        {message && (
          <div className="
            flex items-center gap-3 rounded-xl
            border border-emerald-200 bg-emerald-50
            px-4 py-3.5 text-sm text-emerald-700
            dark:border-emerald-500/20
            dark:bg-emerald-500/10 dark:text-emerald-400
          ">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="
            rounded-xl border border-red-200
            bg-red-50 px-4 py-3.5 text-sm text-red-700
            dark:border-red-500/20
            dark:bg-red-500/10 dark:text-red-400
          ">
            {error}
          </div>
        )}

        {/* Agency Summary */}
        <section className="
          relative overflow-hidden rounded-2xl
          border border-slate-200/80
          bg-gradient-to-br from-white via-white to-blue-50/60
          p-5 shadow-sm shadow-slate-200/40
          dark:border-white/[0.08]
          dark:from-slate-900 dark:via-slate-900
          dark:to-blue-950/30 dark:shadow-black/10
          sm:p-6
        ">
          <div className="
            pointer-events-none absolute -right-16 -top-20
            h-56 w-56 rounded-full bg-blue-400/10 blur-3xl
          " />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Agency Logo */}
            <div className="
              flex h-16 w-16 shrink-0 items-center
              justify-center overflow-hidden rounded-2xl
              border border-slate-200 bg-white shadow-sm
              dark:border-white/10 dark:bg-slate-950
            ">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt="Agency logo"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            {/* Agency Details */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {profile.name || "Your Travel Agency"}
                </h2>

                <span className="
                  rounded-full border border-emerald-200
                  bg-emerald-50 px-2.5 py-1
                  text-[10px] font-semibold uppercase tracking-wider
                  text-emerald-700
                  dark:border-emerald-500/20
                  dark:bg-emerald-500/10 dark:text-emerald-400
                ">
                  Agency Profile
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {profile.email || "Add your business email address"}
              </p>

              <div className="
                mt-3 flex flex-wrap items-center gap-x-4 gap-y-2
                text-xs text-slate-500 dark:text-slate-400
              ">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  {profile.city || "City not added"}
                  {profile.country ? `, ${profile.country}` : ""}
                </span>

                {profile.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Website Link */}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex shrink-0 items-center gap-2
                  rounded-xl border border-slate-200
                  bg-white/80 px-4 py-2.5
                  text-xs font-semibold text-slate-700
                  transition hover:border-blue-300
                  hover:text-blue-600
                  dark:border-white/10 dark:bg-white/[0.03]
                  dark:text-slate-300 dark:hover:text-blue-400
                "
              >
                <Globe className="h-4 w-4" />
                Visit Website
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </section>

        {/* Main Form */}
        <form onSubmit={saveProfile} className="space-y-6">

          {/* Section Navigation */}
          <div className="
            sticky top-3 z-30 overflow-x-auto rounded-2xl
            border border-slate-200/80 bg-white/85
            p-2 shadow-lg shadow-slate-200/20
            backdrop-blur-xl
            dark:border-white/[0.08]
            dark:bg-slate-900/85 dark:shadow-black/10
          ">
            <div className="flex min-w-max gap-2">
              {navigation.map((item) => {
                const active = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    aria-current={active ? "location" : undefined}
                    className={`
                      inline-flex items-center gap-2
                      rounded-xl px-4 py-3
                      text-sm font-medium transition-all duration-200
                      ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.07] dark:hover:text-white"
                      }
                    `}
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

          {/* Sticky Save Bar */}
          <div className="
            sticky bottom-4 z-30
            flex flex-col justify-between gap-4
            rounded-2xl border border-slate-200/80
            bg-white/90 p-4 shadow-xl
            shadow-slate-300/20 backdrop-blur-xl
            dark:border-white/[0.08]
            dark:bg-slate-900/90 dark:shadow-black/20
            sm:flex-row sm:items-center sm:p-5
          ">
            <div className="flex items-center gap-3">
              <div className="
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-xl
                bg-blue-50 text-blue-600
                dark:bg-blue-500/10 dark:text-blue-400
              ">
                <Save className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Save your agency information
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Save your changes to your agency account.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-blue-600 px-6 py-3
                text-sm font-semibold text-white
                shadow-sm shadow-blue-600/20
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-blue-700
                hover:shadow-md hover:shadow-blue-600/20
                focus-visible:outline-none
                focus-visible:ring-4 focus-visible:ring-blue-500/20
                disabled:cursor-not-allowed disabled:opacity-60
              "
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

        {/* Footer */}
        <footer className="
          flex flex-col items-center justify-center gap-2
          pb-5 text-center text-xs text-slate-400
          dark:text-slate-500 sm:flex-row
        ">
          <span>Travel Agency Management System</span>
          <span className="hidden sm:inline">|</span>
          <span>Code Scape Labs</span>
        </footer>
      </div>
    </main>
  );
}
