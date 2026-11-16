
import { MapPin, MapPinned } from "lucide-react";
import { ProfileField } from "./profile-field";
import type { AgencyProfile } from "./profile-types";

interface AddressSectionProps {
  profile: AgencyProfile;
  updateField: (field: keyof AgencyProfile, value: string) => void;
}

export function AddressSection({
  profile,
  updateField,
}: AddressSectionProps) {
  return (
    <section
      id="address"
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7"
    >
      {/* Section heading */}
      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <MapPinned className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Business Address
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your registered or operating business location.
          </p>
        </div>
      </div>

      {/* Address fields */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <ProfileField
            label="Address Line 1"
            value={profile.addressLine1}
            placeholder="Street address"
            icon={MapPin}
            onChange={(value) => updateField("addressLine1", value)}
          />
        </div>

        <div className="md:col-span-2">
          <ProfileField
            label="Address Line 2"
            value={profile.addressLine2}
            placeholder="Building, floor or additional address"
            onChange={(value) => updateField("addressLine2", value)}
          />
        </div>

        <ProfileField
          label="City"
          value={profile.city}
          placeholder="Enter your city"
          onChange={(value) => updateField("city", value)}
        />

        <ProfileField
          label="Postal Code"
          value={profile.postalCode}
          placeholder="Enter postal code"
          onChange={(value) => updateField("postalCode", value)}
        />

        <div className="md:col-span-2">
          <ProfileField
            label="Country"
            value={profile.country}
            placeholder="Enter your country"
            onChange={(value) => updateField("country", value)}
          />
        </div>
      </div>
    </section>
  );
}
