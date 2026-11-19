
"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Building2,
  Upload,
  ImagePlus,
  Loader2,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

import { ProfileField } from "./profile-field";
import { LogoEditor } from "./logo-editor";
import type { AgencyProfile } from "./profile-types";

interface CompanySectionProps {
  profile: AgencyProfile;
  updateField: (field: keyof AgencyProfile, value: string) => void;
}

export function CompanySection({
  profile,
  updateField,
}: CompanySectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadError("");
    setUploadSuccess("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a PNG, JPG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("The original image must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImageToEdit(imageUrl);

    event.target.value = "";
  }

  async function handleEditedLogo(file: File) {
    const formData = new FormData();
    formData.append("logo", file);

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const response = await fetch("/api/agency/logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Logo upload failed.");
      }

      updateField("logoUrl", data.logoUrl);
      setUploadSuccess("Agency logo uploaded successfully.");

      if (imageToEdit) {
        URL.revokeObjectURL(imageToEdit);
      }

      setImageToEdit(null);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Unable to upload logo."
      );
    } finally {
      setUploading(false);
    }
  }

  function cancelLogoEditing() {
    if (imageToEdit) {
      URL.revokeObjectURL(imageToEdit);
    }

    setImageToEdit(null);
  }

  return (
    <section
      id="company"
      className="
        scroll-mt-28 overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white/90
        shadow-sm shadow-slate-200/40
        transition-colors duration-300
        dark:border-white/[0.08]
        dark:bg-slate-900/80
        dark:shadow-black/10
      "
    >
      {/* Section Header */}
      <div className="border-b border-slate-100 px-6 py-6 dark:border-white/[0.07] md:px-7">
        <div className="flex items-center gap-4">
          <div className="
            flex h-12 w-12 shrink-0 items-center justify-center
            rounded-2xl border border-blue-100
            bg-gradient-to-br from-blue-50 to-indigo-100
            text-blue-600 shadow-sm
            dark:border-blue-400/20
            dark:from-blue-500/15 dark:to-indigo-500/10
            dark:text-blue-400
          ">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Company Information
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your agency's official business identity.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-7">

        {/* Agency Logo */}
        <div className="
          relative overflow-hidden rounded-2xl
          border border-slate-200/80
          bg-gradient-to-br from-slate-50 via-white to-blue-50/50
          p-5
          dark:border-white/[0.08]
          dark:from-slate-800/80 dark:via-slate-900/70
          dark:to-blue-950/20
          md:p-6
        ">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Logo Preview */}
            <div className="
              flex h-28 w-28 shrink-0 items-center justify-center
              overflow-hidden rounded-2xl
              border border-slate-200 bg-white
              shadow-sm
              dark:border-white/10 dark:bg-slate-950
            ">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt="Agency logo"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImagePlus className="h-9 w-9" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    No Logo
                  </span>
                </div>
              )}
            </div>

            {/* Upload Information */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Agency Brand Logo
                </h3>

                {profile.logoUrl && (
                  <span className="
                    inline-flex items-center gap-1 rounded-full
                    bg-emerald-50 px-2 py-1
                    text-[10px] font-semibold text-emerald-700
                    dark:bg-emerald-500/10 dark:text-emerald-400
                  ">
                    <CheckCircle2 className="h-3 w-3" />
                    Uploaded
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
                Upload your company logo and customize its appearance.
                Your logo can be used across your itineraries and invoices.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <ImageIcon className="h-3.5 w-3.5" />
                PNG, JPG or WebP
                <span>•</span>
                Maximum 10 MB
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageSelection}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="
                  mt-4 inline-flex items-center gap-2
                  rounded-xl bg-blue-600 px-4 py-2.5
                  text-sm font-medium text-white
                  shadow-sm shadow-blue-600/20
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-blue-700
                  hover:shadow-md hover:shadow-blue-600/20
                  focus-visible:outline-none
                  focus-visible:ring-4 focus-visible:ring-blue-500/20
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : profile.logoUrl ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {uploading
                  ? "Uploading..."
                  : profile.logoUrl
                    ? "Change & Edit Logo"
                    : "Upload & Edit Logo"}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="
              relative mt-5 flex items-center gap-2
              rounded-xl border border-emerald-200
              bg-emerald-50 px-4 py-3
              text-sm text-emerald-700
              dark:border-emerald-500/20
              dark:bg-emerald-500/10 dark:text-emerald-400
            ">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {uploadSuccess}
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="
              relative mt-5 rounded-xl
              border border-red-200 bg-red-50
              px-4 py-3 text-sm text-red-700
              dark:border-red-500/20
              dark:bg-red-500/10 dark:text-red-400
            ">
              {uploadError}
            </div>
          )}
        </div>

        {/* Company Details */}
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Business Details
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter the official details of your travel agency.
            </p>
          </div>

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
              <label
                htmlFor="company-description"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company Description
              </label>

              <textarea
                id="company-description"
                rows={4}
                value={profile.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Tell customers about your travel agency, services and experience..."
                className="
                  w-full resize-y rounded-xl
                  border border-slate-200 bg-white/80
                  px-4 py-3 text-sm text-slate-900
                  outline-none transition-all duration-200
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  dark:border-white/10 dark:bg-slate-950/50
                  dark:text-white dark:placeholder:text-slate-500
                  dark:hover:border-white/20
                  dark:focus:border-blue-400
                  dark:focus:ring-blue-400/10
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Editor Modal */}
      {imageToEdit && (
        <LogoEditor
          image={imageToEdit}
          onCancel={cancelLogoEditing}
          onSave={handleEditedLogo}
        />
      )}
    </section>
  );
}
