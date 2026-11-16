
import { Globe, Mail, Phone } from "lucide-react";
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
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7"
    >
      {/* Section heading */}
      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Phone className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Contact Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your agency's business communication details.
          </p>
        </div>
      </div>

      {/* Contact fields */}
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
    </section>
  );
}
