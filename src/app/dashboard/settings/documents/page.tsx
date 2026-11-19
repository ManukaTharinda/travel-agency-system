
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Palette,
  Type,
  Search,
  Check,
  Save,
  Loader2,
  Sparkles,
  FileText,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Eye,
  Paintbrush,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

type BrandingSettings = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
};

const defaultSettings: BrandingSettings = {
  primaryColor: "#2563EB",
  secondaryColor: "#0F172A",
  accentColor: "#F59E0B",
  fontFamily: "Poppins",
};

const palettes = [
  {
    name: "Ocean Blue",
    primaryColor: "#2563EB",
    secondaryColor: "#0F172A",
    accentColor: "#F59E0B",
  },
  {
    name: "Forest Green",
    primaryColor: "#166534",
    secondaryColor: "#14532D",
    accentColor: "#D4A373",
  },
  {
    name: "Luxury Gold",
    primaryColor: "#B08D57",
    secondaryColor: "#1C1917",
    accentColor: "#E7C873",
  },
  {
    name: "Tropical",
    primaryColor: "#0891B2",
    secondaryColor: "#164E63",
    accentColor: "#F97316",
  },
  {
    name: "Royal Purple",
    primaryColor: "#7C3AED",
    secondaryColor: "#2E1065",
    accentColor: "#F0ABFC",
  },
  {
    name: "Sunset",
    primaryColor: "#EA580C",
    secondaryColor: "#431407",
    accentColor: "#FACC15",
  },
];

const googleFonts = [
  { name: "Poppins", category: "Sans Serif", weights: [400, 500, 600, 700] },
  { name: "Montserrat", category: "Sans Serif", weights: [400, 500, 600, 700] },
  { name: "Roboto", category: "Sans Serif", weights: [400, 500, 700] },
  { name: "Open Sans", category: "Sans Serif", weights: [400, 600, 700] },
  { name: "Lato", category: "Sans Serif", weights: [400, 700] },
  { name: "Nunito", category: "Sans Serif", weights: [400, 600, 700] },
  { name: "Raleway", category: "Sans Serif", weights: [400, 600, 700] },
  { name: "Inter", category: "Sans Serif", weights: [400, 500, 600, 700] },
  { name: "Oswald", category: "Display", weights: [400, 500, 700] },
  { name: "Playfair Display", category: "Serif", weights: [400, 500, 600, 700] },
  { name: "Merriweather", category: "Serif", weights: [400, 700] },
  { name: "Lora", category: "Serif", weights: [400, 500, 700] },
  { name: "Bebas Neue", category: "Display", weights: [400] },
  { name: "Dancing Script", category: "Handwriting", weights: [400, 500, 700] },
  { name: "Pacifico", category: "Handwriting", weights: [400] },
  { name: "Roboto Mono", category: "Monospace", weights: [400, 500, 700] },
];

const fontCategories = [
  "All",
  "Sans Serif",
  "Serif",
  "Display",
  "Handwriting",
  "Monospace",
];

const colorFields = [
  {
    key: "primaryColor" as const,
    label: "Primary Colour",
    description: "Main brand colour for headings and buttons.",
  },
  {
    key: "secondaryColor" as const,
    label: "Secondary Colour",
    description: "Used for backgrounds and document sections.",
  },
  {
    key: "accentColor" as const,
    label: "Accent Colour",
    description: "Highlights, decorative elements and details.",
  },
];

const panelClass = `
  overflow-hidden rounded-2xl
  border border-slate-200/80 bg-white/90
  shadow-sm shadow-slate-200/40
  transition-colors duration-300
  dark:border-white/[0.08]
  dark:bg-slate-900/80 dark:shadow-black/10
`;

const inputClass = `
  h-11 w-full rounded-xl
  border border-slate-200 bg-white/80
  px-4 text-sm text-slate-900 outline-none
  transition-all placeholder:text-slate-400
  hover:border-slate-300
  focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
  dark:border-white/10 dark:bg-slate-950/50
  dark:text-white dark:placeholder:text-slate-500
  dark:hover:border-white/20
  dark:focus:border-blue-400 dark:focus:ring-blue-400/10
`;

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Palette;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-white/[0.07] sm:px-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 dark:border-blue-400/20 dark:from-blue-500/15 dark:to-indigo-500/10 dark:text-blue-400">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DocumentSettingsPage() {
  const [settings, setSettings] =
    useState<BrandingSettings>(defaultSettings);

  const [fontSearch, setFontSearch] = useState("");
  const [fontCategory, setFontCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load agency settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/agency/document-settings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load settings.");
        }

        setSettings({
          primaryColor: data.settings.primaryColor,
          secondaryColor: data.settings.secondaryColor,
          accentColor: data.settings.accentColor,
          fontFamily: data.settings.fontFamily,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Load selected Google Font
  useEffect(() => {
    const selectedFont = googleFonts.find(
      (font) => font.name === settings.fontFamily
    );

    if (!selectedFont) return;

    const params = new URLSearchParams({
      family: `${selectedFont.name}:wght@${selectedFont.weights.join(";")}`,
      display: "swap",
    });

    const link = document.createElement("link");

    link.href = `https://fonts.googleapis.com/css2?${params.toString()}`;
    link.rel = "stylesheet";
    link.dataset.googleFont = selectedFont.name;

    document.head
      .querySelectorAll('link[data-google-font]')
      .forEach((element) => element.remove());

    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [settings.fontFamily]);

  // Search and filter fonts
  const filteredFonts = useMemo(() => {
    return googleFonts.filter((font) => {
      const matchesSearch = font.name
        .toLowerCase()
        .includes(fontSearch.toLowerCase());

      const matchesCategory =
        fontCategory === "All" || font.category === fontCategory;

      return matchesSearch && matchesCategory;
    });
  }, [fontSearch, fontCategory]);

  // Update colours
  function updateColor(
    key: "primaryColor" | "secondaryColor" | "accentColor",
    value: string
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage("");
    setError("");
  }

  // Apply preset palette
  function applyPalette(palette: (typeof palettes)[number]) {
    setSettings((previous) => ({
      ...previous,
      primaryColor: palette.primaryColor,
      secondaryColor: palette.secondaryColor,
      accentColor: palette.accentColor,
    }));

    setMessage("");
    setError("");
  }

  // Select font
  function selectFont(fontName: string) {
    setSettings((previous) => ({
      ...previous,
      fontFamily: fontName,
    }));

    setMessage("");
    setError("");
  }

  // Save settings
  async function saveSettings() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/agency/document-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save settings.");
      }

      setMessage("Your branding settings have been saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedFont = googleFonts.find(
    (font) => font.name === settings.fontFamily
  );

  const fontStyle = {
    fontFamily: `"${settings.fontFamily}", sans-serif`,
  };

  // Loading screen
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 px-10 py-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Loading Document Branding
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Please wait while we retrieve your settings.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Page Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace Settings
              <span className="text-blue-300 dark:text-blue-500">/</span>
              Document Branding
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Document Branding
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Customize the appearance of your agency itineraries and invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-400 sm:flex">
              <Paintbrush className="h-4 w-4" />
              Branding Settings
            </div>

            <ThemeToggle />

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        {/* Alerts */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Main Layout */}
        <div className="grid items-start gap-7 xl:grid-cols-[1fr_0.95fr]">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Brand Colours */}
            <section className={panelClass}>
              <SectionHeader
                icon={Palette}
                title="Brand Colours"
                description="Customize your agency's document colour scheme."
              />

              <div className="space-y-6 p-5 sm:p-6">
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Choose any colour using the colour picker or enter a HEX value.
                  Your changes appear instantly in the previews.
                </p>

                {colorFields.map((field) => {
                  const validColor = /^#[0-9A-Fa-f]{6}$/.test(
                    settings[field.key]
                  );

                  return (
                    <div key={field.key}>
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {field.label}
                      </label>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {field.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-slate-950">
                          <input
                            type="color"
                            value={validColor ? settings[field.key] : "#000000"}
                            onChange={(event) =>
                              updateColor(
                                field.key,
                                event.target.value.toUpperCase()
                              )
                            }
                            aria-label={`Choose ${field.label}`}
                            className="h-full w-full cursor-pointer rounded-lg border-0 bg-transparent"
                          />
                        </div>

                        <input
                          type="text"
                          value={settings[field.key]}
                          maxLength={7}
                          onChange={(event) =>
                            updateColor(
                              field.key,
                              event.target.value.toUpperCase()
                            )
                          }
                          placeholder="#2563EB"
                          aria-label={`${field.label} HEX value`}
                          className={`${inputClass} font-mono uppercase`}
                        />

                        <div
                          className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 dark:border-white/10"
                          style={{
                            backgroundColor: validColor
                              ? settings[field.key]
                              : "transparent",
                          }}
                        />
                      </div>

                      {!validColor && settings[field.key] !== "" && (
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Enter a valid six-digit HEX colour, e.g. #2563EB.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Preset Palettes */}
            <section className={panelClass}>
              <SectionHeader
                icon={Sparkles}
                title="Preset Colour Palettes"
                description="Choose a ready-made professional colour combination."
              />

              <div className="space-y-3 p-5 sm:p-6">
                {palettes.map((palette) => {
                  const active =
                    settings.primaryColor === palette.primaryColor &&
                    settings.secondaryColor === palette.secondaryColor &&
                    settings.accentColor === palette.accentColor;

                  return (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => applyPalette(palette)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                        active
                          ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/10 dark:border-blue-400 dark:bg-blue-500/10"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[
                            palette.primaryColor,
                            palette.secondaryColor,
                            palette.accentColor,
                          ].map((color) => (
                            <span
                              key={color}
                              className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {palette.name}
                        </span>
                      </div>

                      {active && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Google Fonts */}
            <section className={panelClass}>
              <SectionHeader
                icon={Type}
                title="Typography"
                description="Choose a Google Font for your travel documents."
              />

              <div className="p-5 sm:p-6">

                {/* Google Fonts Label */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Browse, preview and select your preferred font.
                  </p>

                  <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
                    Google Fonts
                  </span>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={fontSearch}
                    onChange={(event) => setFontSearch(event.target.value)}
                    placeholder="Search fonts..."
                    className={`${inputClass} pl-11`}
                  />
                </div>

                {/* Categories */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {fontCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFontCategory(category)}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                        fontCategory === category
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Selected Font */}
                <div className="mt-5 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 dark:border-blue-400/20 dark:from-blue-500/10 dark:to-indigo-500/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                      Selected Typography
                    </p>

                    <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                      Active
                    </span>
                  </div>

                  <h3
                    className="mt-3 text-3xl font-bold text-slate-900 dark:text-white"
                    style={fontStyle}
                  >
                    {settings.fontFamily}
                  </h3>

                  <p
                    className="mt-2 text-sm text-slate-600 dark:text-slate-300"
                    style={fontStyle}
                  >
                    Travel Beyond the Ordinary
                  </p>

                  <p className="mt-3 text-xs text-blue-700/70 dark:text-blue-400/70">
                    {selectedFont?.category ?? "System font"} · Document typography
                  </p>
                </div>

                {/* Font List */}
                <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-1">
                  {filteredFonts.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/10">
                      <Search className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        No fonts found
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Try another search or category.
                      </p>
                    </div>
                  )}

                  {filteredFonts.map((font) => {
                    const active = settings.fontFamily === font.name;

                    return (
                      <button
                        key={font.name}
                        type="button"
                        onClick={() => selectFont(font.name)}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${
                          active
                            ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/10 dark:border-blue-400 dark:bg-blue-500/10"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p
                              className="text-lg font-semibold text-slate-900 dark:text-white"
                              style={{ fontFamily: `"${font.name}", sans-serif` }}
                            >
                              {font.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {font.category} · Weights: {font.weights.join(", ")}
                            </p>
                          </div>

                          {active && (
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </div>

                        <p
                          className="mt-3 text-sm text-slate-600 dark:text-slate-300"
                          style={{ fontFamily: `"${font.name}", sans-serif` }}
                        >
                          Discover beautiful destinations around the world.
                        </p>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-400 dark:text-slate-500">
                  Fonts load from Google Fonts. An internet connection is required.
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - LIVE PREVIEWS */}
          <section className="space-y-6 xl:sticky xl:top-6">

            {/* Preview Heading */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
                <Eye className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Live Document Preview
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Preview your branding before saving.
                </p>
              </div>
            </div>

            {/* Itinerary Preview */}
            <div className={panelClass}>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Itinerary Preview
                  </h3>
                </div>

                <span className="text-[10px] font-semibold tracking-wider text-slate-400">
                  DOCUMENT 01
                </span>
              </div>

              {/* Document Canvas */}
              <div className="bg-slate-100/70 p-3 dark:bg-slate-950/50 sm:p-5">
                <div
                  className="mx-auto max-w-[520px] bg-white p-5 shadow-md sm:p-7"
                  style={fontStyle}
                >
                  <div
                    className="rounded-xl p-6 text-white"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <p className="text-[10px] font-semibold tracking-[0.2em] opacity-80">
                      YOUR TRAVEL AGENCY
                    </p>

                    <h3 className="mt-5 text-2xl font-bold">
                      Sri Lanka Tour
                    </h3>

                    <p className="mt-2 text-sm opacity-90">
                      8 Days / 7 Nights
                    </p>
                  </div>

                  <div className="mt-7">
                    <h4
                      className="text-lg font-bold"
                      style={{ color: settings.secondaryColor }}
                    >
                      Your Journey
                    </h4>

                    <div
                      className="mt-4 rounded-r-lg border-l-4 bg-slate-50 p-4"
                      style={{ borderColor: settings.accentColor }}
                    >
                      <p className="text-sm font-bold text-slate-800">
                        Day 01 – Arrival in Sri Lanka
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Airport pickup, hotel transfer and welcome experience.
                      </p>
                    </div>

                    <div
                      className="mt-3 rounded-r-lg border-l-4 bg-slate-50 p-4"
                      style={{ borderColor: settings.accentColor }}
                    >
                      <p className="text-sm font-bold text-slate-800">
                        Day 02 – Explore Cultural Heritage
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Discover local attractions and experience Sri Lankan culture.
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-7 border-t pt-5 text-center text-xs text-slate-500"
                    style={{ borderColor: settings.accentColor }}
                  >
                    Travel Beyond the Ordinary
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className={panelClass}>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Invoice Preview
                  </h3>
                </div>

                <span className="text-[10px] font-semibold tracking-wider text-slate-400">
                  DOCUMENT 02
                </span>
              </div>

              {/* Document Canvas */}
              <div className="bg-slate-100/70 p-3 dark:bg-slate-950/50 sm:p-5">
                <div
                  className="mx-auto max-w-[520px] bg-white p-5 shadow-md sm:p-7"
                  style={fontStyle}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: settings.primaryColor }}
                      >
                        YOUR AGENCY
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Travel Agency
                      </p>
                    </div>

                    <div className="text-right">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: settings.secondaryColor }}
                      >
                        INVOICE
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        INV-0001
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-7 rounded-xl p-4"
                    style={{ backgroundColor: settings.secondaryColor }}
                  >
                    <p className="text-[10px] font-semibold tracking-wider text-white/70">
                      BILL TO
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      Sample Customer
                    </p>

                    <p className="mt-1 text-xs text-white/70">
                      Sri Lanka Tour Package
                    </p>
                  </div>

                  <div className="mt-7 space-y-4">
                    <div className="flex justify-between gap-3 text-xs text-slate-600">
                      <span>Tour Package</span>
                      <span>LKR 150,000.00</span>
                    </div>

                    <div className="flex justify-between gap-3 text-xs text-slate-600">
                      <span>Transportation</span>
                      <span>LKR 25,000.00</span>
                    </div>

                    <div
                      className="flex justify-between border-t pt-4 text-sm font-bold"
                      style={{
                        borderColor: settings.accentColor,
                        color: settings.primaryColor,
                      }}
                    >
                      <span>Total</span>
                      <span>LKR 175,000.00</span>
                    </div>
                  </div>

                  <div
                    className="mt-7 rounded-xl p-4 text-center text-sm font-semibold text-white"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Thank You For Choosing Us!
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Details */}
            <div className={panelClass}>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Current Typography
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-b border-slate-100 py-3 dark:border-white/[0.07]">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Selected Font
                  </span>

                  <span
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                    style={fontStyle}
                  >
                    {settings.fontFamily}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Font Category
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedFont?.category ?? "System font"}
                  </span>
                </div>
              </div>
            </div>

            {/* Colour Summary */}
            <div className={panelClass}>
              <div className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Active Brand Colours
                </h3>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {colorFields.map((field) => (
                    <div key={field.key}>
                      <div
                        className="h-12 rounded-xl border border-black/5 dark:border-white/10"
                        style={{
                          backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(
                            settings[field.key]
                          )
                            ? settings[field.key]
                            : "transparent",
                        }}
                      />

                      <p className="mt-2 truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {field.label}
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                        {settings[field.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-4 z-30 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl shadow-slate-300/20 backdrop-blur-xl dark:border-white/[0.08] dark:bg-slate-900/90 dark:shadow-black/20 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Save className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Save your document branding
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Apply your selected colours and typography to your agency settings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Footer */}
        <footer className="pb-5 text-center text-xs text-slate-400 dark:text-slate-500">
          Travel Agency Management System · Document Branding
        </footer>
      </div>
    </main>
  );
}
