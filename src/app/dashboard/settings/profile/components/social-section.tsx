
"use client";

import {
  Camera,
  Globe,
  Music2,
  Share2,
  BriefcaseBusiness,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import { ProfileField } from "./profile-field";
import type { AgencyProfile } from "./profile-types";

interface SocialSectionProps {
  profile: AgencyProfile;
  updateField: (field: keyof AgencyProfile, value: string) => void;
}

export function SocialSection({
  profile,
  updateField,
}: SocialSectionProps) {
  return (
    <section
      id="social"
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
          <Share2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Social Media Presence
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Connect your agency's social media profiles.
          </p>
        </div>
      </div>

      {/* Social Media Details */}
      <div className="space-y-6 p-6 md:p-7">

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Online Presence
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add your official social media links to help customers discover and connect with your agency.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <ProfileField
            label="Facebook"
            type="url"
            value={profile.facebookUrl}
            placeholder="https://facebook.com/youragency"
            icon={Globe}
            onChange={(value) => updateField("facebookUrl", value)}
          />

          <ProfileField
            label="Instagram"
            type="url"
            value={profile.instagramUrl}
            placeholder="https://instagram.com/youragency"
            icon={Camera}
            onChange={(value) => updateField("instagramUrl", value)}
          />

          <ProfileField
            label="TikTok"
            type="url"
            value={profile.tiktokUrl}
            placeholder="https://tiktok.com/@youragency"
            icon={Music2}
            onChange={(value) => updateField("tiktokUrl", value)}
          />

          <ProfileField
            label="LinkedIn"
            type="url"
            value={profile.linkedinUrl}
            placeholder="https://linkedin.com/company/youragency"
            icon={BriefcaseBusiness}
            onChange={(value) => updateField("linkedinUrl", value)}
          />
        </div>

        {/* Information Note */}
        <div className="
          flex items-start gap-3 rounded-xl
          border border-blue-100 bg-blue-50/70
          px-4 py-3
          dark:border-blue-400/15 dark:bg-blue-500/[0.07]
        ">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
              Build your online presence
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700/80 dark:text-blue-400/80">
              Use your official agency profile URLs. These links can
              help customers find your travel agency across social
              media platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
