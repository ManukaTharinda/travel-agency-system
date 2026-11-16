
import { Camera, Globe, Music2, Share2, BriefcaseBusiness } from "lucide-react";
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
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7"
    >
      {/* Section heading */}
      <div className="mb-7 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Share2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Social Media Presence
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Connect your agency's social media profiles.
          </p>
        </div>
      </div>

      {/* Social media fields */}
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
    </section>
  );
}
