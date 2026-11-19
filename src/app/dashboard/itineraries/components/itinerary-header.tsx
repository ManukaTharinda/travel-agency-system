
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Compass,
  Plus,
  Sparkles,
} from "lucide-react";

export default function ItineraryHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-indigo-500/[0.08] blur-3xl" />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>

          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />

          <span className="font-medium text-foreground">
            Itineraries
          </span>
        </div>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          {/* Heading */}
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-500">
              <Sparkles className="h-3.5 w-3.5" />
              Travel Planning Workspace
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Compass className="h-6 w-6 text-blue-500" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Itinerary Management
              </h1>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Create, organize, and manage personalized travel itineraries.
              Plan every journey with daily activities, accommodation,
              transportation, and travel details in one place.
            </p>
          </div>

          {/* Create button */}
          <div className="flex shrink-0">
            <Link
              href="/dashboard/itineraries/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              <Plus className="h-4 w-4" />
              Create Itinerary
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
