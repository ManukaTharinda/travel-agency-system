
import Link from "next/link";
import {
  Compass,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

interface ItineraryEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export default function ItineraryEmptyState({
  hasFilters = false,
  onClearFilters,
}: ItineraryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-14 text-center backdrop-blur-xl">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-500/10">
          {hasFilters ? (
            <Search className="h-9 w-9 text-blue-500" />
          ) : (
            <Compass className="h-9 w-9 text-blue-500" />
          )}
        </div>

        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
          <Sparkles className="h-4 w-4 text-blue-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {hasFilters
          ? "No matching itineraries"
          : "Your travel planning starts here"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {hasFilters
          ? "We couldn't find any itineraries matching your search or selected filters. Try changing your search criteria."
          : "You haven't created any itineraries yet. Start planning your first journey by creating a personalized travel itinerary."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Search className="h-4 w-4" />
            Clear filters
          </button>
        ) : (
          <Link
            href="/dashboard/itineraries/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Create your first itinerary
          </Link>
        )}
      </div>
    </div>
  );
}
