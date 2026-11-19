
"use client";

import { Globe, Mail, Phone, Radio } from "lucide-react";
import { ProfileField } from "./profile-field";
import type { AgencyProfile } from "./profile-types";

interface ContactSectionProps {
  profile: AgencyProfile;
  updateField: (field: keyof AgencyProfile, value: string) => void;
}

export function ContactSection({
  profile,
  updateField,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="
        scroll-mt-28 overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white/90
        shadow-sm shadow-slate-200/40
        transition-colors duration-300
        dark:border-white/[0.08]
        dark:bg-slate-900/80 dark:shadow-black/10
      "
    >
      {/* Section Header */}
      <div className="
        flex items-center gap-4
        border-b border-slate-100 px-6 py-6
        dark:border-white/[0.07] md:px-7
      ">
        <div className="
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-2xl border border-blue-100
          bg-gradient-to-br from-blue-50 to-indigo-100
          text-blue-600 shadow-sm
          dark:border-blue-400/20
          dark:from-blue-500/15 dark:to-indigo-500/10
          dark:text-blue-400
        ">
          <Phone className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Contact Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your agency's business communication details.
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-6 p-6 md:p-7">

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Business Contact Details
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Provide the contact information customers can use to reach your agency.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileField
            label="Business Email"
            type="email"
            value={profile.email}
            placeholder="hello@youragency.com"
            icon={Mail}
            onChange={(value) => updateField("email", value)}
          />

          <ProfileField
            label="Phone Number"
            type="tel"
            value={profile.phone}
            placeholder="+94 77 123 4567"
            icon={Phone}
            onChange={(value) => updateField("phone", value)}
          />

          <div className="md:col-span-2">
            <ProfileField
              label="Company Website"
              type="url"
              value={profile.website}
              placeholder="https://www.youragency.com"
              icon={Globe}
              onChange={(value) => updateField("website", value)}
            />
          </div>
        </div>

        {/* Information Note */}
        <div className="
          flex items-start gap-3 rounded-xl
          border border-blue-100 bg-blue-50/70
          px-4 py-3
          dark:border-blue-400/15 dark:bg-blue-500/[0.07]
        ">
          <Radio className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

          <p className="text-xs leading-5 text-blue-800 dark:text-blue-300">
            Keep your contact information up to date. These details
            help customers communicate with your agency and may be
            displayed on your travel documents.
          </p>
        </div>
      </div>
    </section>
  );
}
