"use client";

import { ArrowLeft, Check, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface FormActionsSectionProps {
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function FormActionsSection({
  isSubmitting,
  onSubmit,
}: FormActionsSectionProps) {
  return (
    <section className="flex flex-col-reverse gap-3 rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/dashboard/itineraries"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#1E293B] bg-[#10192D] px-5 text-sm font-medium text-[#CBD5E1] transition-colors hover:border-[#334155] hover:bg-[#17243B] hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Cancel
      </Link>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1760F5] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2872FF] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Itinerary...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Create Itinerary
            <Check className="h-4 w-4" />
          </>
        )}
      </button>
    </section>
  );
}