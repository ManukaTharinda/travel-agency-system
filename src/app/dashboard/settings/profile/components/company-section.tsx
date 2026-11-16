
import { Building2 } from "lucide-react";
import { ProfileField } from "./profile-field";
import type { AgencyProfile } from "./profile-types";

interface CompanySectionProps {
  profile: AgencyProfile;
  updateField: (field: keyof AgencyProfile, value: string) => void;
}

export function CompanySection({
  profile,
  updateField,
}: CompanySectionProps) {
  return (
    <section
      id="company"
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7"
    >
      {/* Section heading */}
      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Building2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Company Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your agency's official business identity.
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-5 md:grid-cols-2">
        <ProfileField
          label="Company Name"
          value={profile.name}
          placeholder="Enter your agency name"
          required
          icon={Building2}
          onChange={(value) => updateField("name", value)}
        />

        <ProfileField
          label="Legal Business Name"
          value={profile.legalName}
          placeholder="Enter your registered business name"
          onChange={(value) => updateField("legalName", value)}
        />

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Company Description
          </label>

          <textarea
            rows={4}
            value={profile.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Tell customers about your travel agency, services and experience..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>
    </section>
  );
}
