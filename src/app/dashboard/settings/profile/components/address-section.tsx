
"use client";

import { MapPin, MapPinned, Navigation } from "lucide-react";
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
          <MapPinned className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Business Address
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your registered or operating business location.
          </p>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-6 p-6 md:p-7">

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Location Details
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enter the official address of your travel agency.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Address Line 1 */}
          <div className="md:col-span-2">
            <ProfileField
              label="Address Line 1"
              value={profile.addressLine1}
              placeholder="Street address"
              icon={MapPin}
              onChange={(value) => updateField("addressLine1", value)}
            />
          </div>

          {/* Address Line 2 */}
          <div className="md:col-span-2">
            <ProfileField
              label="Address Line 2"
              value={profile.addressLine2}
              placeholder="Building, floor or additional address"
              onChange={(value) => updateField("addressLine2", value)}
            />
          </div>

          {/* City */}
          <ProfileField
            label="City"
            value={profile.city}
            placeholder="Enter your city"
            onChange={(value) => updateField("city", value)}
          />

          {/* Postal Code */}
          <ProfileField
            label="Postal Code"
            value={profile.postalCode}
            placeholder="Enter postal code"
            onChange={(value) => updateField("postalCode", value)}
          />

          {/* Country */}
          <div className="md:col-span-2">
            <ProfileField
              label="Country"
              value={profile.country}
              placeholder="Enter your country"
              onChange={(value) => updateField("country", value)}
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
          <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

          <p className="text-xs leading-5 text-blue-800 dark:text-blue-300">
            Your business address can be displayed on your agency's
            official itineraries and invoices.
          </p>
        </div>
      </div>
    </section>
  );
}
