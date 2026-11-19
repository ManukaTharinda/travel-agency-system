
import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus } from "lucide-react";

export default function CreateItineraryHeader() {
  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/dashboard/itineraries"
          className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          Itineraries
        </Link>

        <span className="text-slate-300 dark:text-slate-600">/</span>

        <span className="font-medium text-slate-900 dark:text-white">
          Create New
        </span>
      </div>

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 sm:p-7">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-40 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Itinerary Management
                </span>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Create New Itinerary
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Build a personalized travel experience by adding customer
                information, daily activities, accommodation, and travel
                details.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/itineraries"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Itineraries
          </Link>
        </div>

        {/* Bottom information */}
        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            New itinerary
          </span>

          <span className="inline-flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" />
            Add daily activities
          </span>
        </div>
      </div>
    </div>
  );
}
