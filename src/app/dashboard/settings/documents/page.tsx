
"use client";

import { useEffect, useMemo, useState } from "react";

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
        const response = await fetch(
          "/api/agency/document-settings"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load settings."
          );
        }

        setSettings({
          primaryColor: data.settings.primaryColor,
          secondaryColor: data.settings.secondaryColor,
          accentColor: data.settings.accentColor,
          fontFamily: data.settings.fontFamily,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load settings."
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
        fontCategory === "All" ||
        font.category === fontCategory;

      return matchesSearch && matchesCategory;
    });
  }, [fontSearch, fontCategory]);

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

  function applyPalette(
    palette: (typeof palettes)[number]
  ) {
    setSettings((previous) => ({
      ...previous,
      primaryColor: palette.primaryColor,
      secondaryColor: palette.secondaryColor,
      accentColor: palette.accentColor,
    }));

    setMessage("");
    setError("");
  }

  function selectFont(fontName: string) {
    setSettings((previous) => ({
      ...previous,
      fontFamily: fontName,
    }));

    setMessage("");
    setError("");
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/agency/document-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save settings."
        );
      }

      setMessage(
        "Your branding settings have been saved successfully!"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedFont = googleFonts.find(
    (font) => font.name === settings.fontFamily
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading document settings...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">
              AGENCY SETTINGS
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Document Branding
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Customize the appearance of your itineraries and invoices.
            </p>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT COLUMN */}
          <section className="space-y-6">

            {/* Brand colours */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Brand Colours
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose any colour using the picker or enter a HEX value.
              </p>

              <div className="mt-6 space-y-6">
                {colorFields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-semibold text-slate-800">
                      {field.label}
                    </label>

                    <p className="mt-1 text-xs text-slate-500">
                      {field.description}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="color"
                        value={
                          /^#[0-9A-Fa-f]{6}$/.test(settings[field.key])
                            ? settings[field.key]
                            : "#000000"
                        }
                        onChange={(event) =>
                          updateColor(
                            field.key,
                            event.target.value.toUpperCase()
                          )
                        }
                        className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                      />

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
                        className="h-12 w-full rounded-lg border border-slate-300 px-4 font-mono text-sm uppercase outline-none focus:border-blue-500"
                      />

                      <div
                        className="h-12 w-12 shrink-0 rounded-lg border border-slate-200"
                        style={{
                          backgroundColor:
                            /^#[0-9A-Fa-f]{6}$/.test(settings[field.key])
                              ? settings[field.key]
                              : "transparent",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preset palettes */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Preset Colour Palettes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a professional colour combination.
              </p>

              <div className="mt-5 space-y-3">
                {palettes.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => applyPalette(palette)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-slate-800">
                      {palette.name}
                    </span>

                    <span className="flex gap-2">
                      {[
                        palette.primaryColor,
                        palette.secondaryColor,
                        palette.accentColor,
                      ].map((color) => (
                        <span
                          key={color}
                          className="h-7 w-7 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Google Fonts */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Typography
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Browse and select Google Fonts for your documents.
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Google Fonts
                </span>
              </div>

              {/* Search */}
              <div className="mt-5">
                <input
                  type="search"
                  value={fontSearch}
                  onChange={(event) =>
                    setFontSearch(event.target.value)
                  }
                  placeholder="Search fonts..."
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500"
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
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Selected font */}
              <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Selected font
                </p>

                <h3
                  className="mt-2 text-2xl font-semibold text-slate-900"
                  style={{
                    fontFamily: `"${settings.fontFamily}", sans-serif`,
                  }}
                >
                  {settings.fontFamily}
                </h3>

                <p
                  className="mt-2 text-sm text-slate-600"
                  style={{
                    fontFamily: `"${settings.fontFamily}", sans-serif`,
                  }}
                >
                  Travel Beyond the Ordinary
                </p>
              </div>

              {/* Font list */}
              <div className="mt-5 max-h-[430px] space-y-2 overflow-y-auto pr-1">
                {filteredFonts.length === 0 && (
                  <p className="rounded-lg bg-slate-50 p-5 text-center text-sm text-slate-500">
                    No fonts found. Try another search.
                  </p>
                )}

                {filteredFonts.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => selectFont(font.name)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      settings.fontFamily === font.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-lg font-semibold text-slate-900"
                          style={{
                            fontFamily: `"${font.name}", sans-serif`,
                          }}
                        >
                          {font.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {font.category} · Weights: {font.weights.join(", ")}
                        </p>
                      </div>

                      {settings.fontFamily === font.name && (
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                          Selected
                        </span>
                      )}
                    </div>

                    <p
                      className="mt-3 text-sm text-slate-600"
                      style={{
                        fontFamily: `"${font.name}", sans-serif`,
                      }}
                    >
                      Discover beautiful destinations around the world.
                    </p>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Fonts load from Google Fonts. An internet connection is required.
              </p>
            </div>
          </section>

          {/* RIGHT COLUMN - LIVE PREVIEWS */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Live Document Preview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preview your branding before saving.
              </p>
            </div>

            {/* Itinerary preview */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-800">
                  Itinerary Preview
                </h3>

                <span className="text-xs text-slate-400">
                  DOCUMENT 01
                </span>
              </div>

              <div
                className="p-6"
                style={{
                  fontFamily: `"${settings.fontFamily}", sans-serif`,
                }}
              >
                <div
                  className="rounded-lg p-6 text-white"
                  style={{
                    backgroundColor: settings.primaryColor,
                  }}
                >
                  <p className="text-xs font-semibold tracking-widest">
                    YOUR TRAVEL AGENCY
                  </p>

                  <h3 className="mt-4 text-2xl font-bold">
                    Sri Lanka Tour
                  </h3>

                  <p className="mt-2 text-sm opacity-90">
                    8 Days / 7 Nights
                  </p>
                </div>

                <div className="mt-6">
                  <h4
                    className="text-lg font-bold"
                    style={{
                      color: settings.secondaryColor,
                    }}
                  >
                    Your Journey
                  </h4>

                  <div
                    className="mt-3 rounded-lg border-l-4 bg-slate-50 p-4"
                    style={{
                      borderColor: settings.accentColor,
                    }}
                  >
                    <p className="text-sm font-bold text-slate-800">
                      Day 01 – Arrival in Sri Lanka
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Airport pickup, hotel transfer and welcome experience.
                    </p>
                  </div>
                </div>

                <div
                  className="mt-6 border-t pt-4 text-center text-xs text-slate-500"
                  style={{
                    borderColor: settings.accentColor,
                  }}
                >
                  Travel Beyond the Ordinary
                </div>
              </div>
            </div>

            {/* Invoice preview */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-800">
                  Invoice Preview
                </h3>

                <span className="text-xs text-slate-400">
                  DOCUMENT 02
                </span>
              </div>

              <div
                className="p-6"
                style={{
                  fontFamily: `"${settings.fontFamily}", sans-serif`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{
                        color: settings.primaryColor,
                      }}
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
                      style={{
                        color: settings.secondaryColor,
                      }}
                    >
                      INVOICE
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      INV-0001
                    </p>
                  </div>
                </div>

                <div
                  className="mt-6 rounded-lg p-4"
                  style={{
                    backgroundColor: settings.secondaryColor,
                  }}
                >
                  <p className="text-xs font-semibold text-white">
                    BILL TO
                  </p>

                  <p className="mt-2 text-sm font-bold text-white">
                    Sample Customer
                  </p>

                  <p className="mt-1 text-xs text-white/70">
                    Sri Lanka Tour Package
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tour Package</span>
                    <span>LKR 150,000.00</span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Transportation</span>
                    <span>LKR 25,000.00</span>
                  </div>

                  <div
                    className="flex justify-between border-t pt-4 text-base font-bold"
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
                  className="mt-6 rounded-lg p-4 text-center text-sm font-semibold text-white"
                  style={{
                    backgroundColor: settings.primaryColor,
                  }}
                >
                  Thank You For Choosing Us!
                </div>
              </div>
            </div>

            {/* Font details */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">
                Current Typography
              </h3>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Selected font
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {settings.fontFamily}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Font category
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {selectedFont?.category ?? "System font"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
