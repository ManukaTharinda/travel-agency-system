"use client";

import {
  FileText,
  CheckCircle2,
  XCircle,
  StickyNote,
} from "lucide-react";

export interface AdditionalDetails {
  description: string;
  inclusions: string;
  exclusions: string;
  notes: string;
}

interface AdditionalDetailsSectionProps {
  values: AdditionalDetails;
  onChange: (
    field: keyof AdditionalDetails,
    value: string
  ) => void;
}

export default function AdditionalDetailsSection({
  values,
  onChange,
}: AdditionalDetailsSectionProps) {
  const textareaClass =
    "w-full resize-y rounded-lg border border-[#1E293B] bg-[#10192D] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition-colors placeholder:text-[#64748B] focus:border-[#1760F5] focus:ring-2 focus:ring-[#1760F5]/15";

  const sections = [
    {
      field: "description" as const,
      title: "Itinerary Description",
      subtitle: "Provide an overview of the travel experience.",
      placeholder:
        "Describe the travel package, destinations, and overall experience...",
      icon: FileText,
      color: "text-blue-400",
      rows: 3,
    },
    {
      field: "inclusions" as const,
      title: "What's Included",
      subtitle: "List services and facilities included in the package.",
      placeholder:
        "Example:\nAccommodation throughout the tour\nDaily breakfast\nPrivate transportation\nAirport transfers",
      icon: CheckCircle2,
      color: "text-emerald-400",
      rows: 4,
    },
    {
      field: "exclusions" as const,
      title: "What's Not Included",
      subtitle: "List expenses and services excluded from the package.",
      placeholder:
        "Example:\nInternational flight tickets\nPersonal expenses\nTravel insurance\nAdditional activities",
      icon: XCircle,
      color: "text-rose-400",
      rows: 4,
    },
    {
      field: "notes" as const,
      title: "Internal Notes",
      subtitle: "Additional information for your agency team.",
      placeholder:
        "Add special instructions, customer preferences, supplier details, or internal reminders...",
      icon: StickyNote,
      color: "text-amber-400",
      rows: 3,
    },
  ];

  return (
    <section className="rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:p-5">
      {/* Section heading */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
          <FileText className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#F8FAFC]">
            Additional Information
          </h2>

          <p className="mt-0.5 text-xs text-[#94A3B8]">
            Add descriptions, inclusions, exclusions, and internal notes.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <div key={section.field}>
              <div className="mb-1.5 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${section.color}`} />

                <label
                  htmlFor={`itinerary-${section.field}`}
                  className="text-sm font-medium text-[#E2E8F0]"
                >
                  {section.title}
                </label>
              </div>

              <p className="mb-2 text-xs text-[#64748B]">
                {section.subtitle}
              </p>

              <textarea
                id={`itinerary-${section.field}`}
                value={values[section.field]}
                onChange={(event) =>
                  onChange(section.field, event.target.value)
                }
                placeholder={section.placeholder}
                rows={section.rows}
                className={textareaClass}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}