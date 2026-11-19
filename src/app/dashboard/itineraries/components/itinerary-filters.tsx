
"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import {
  ITINERARY_STATUS_OPTIONS,
  type ItineraryFilters,
} from "./itinerary-types";

interface ItineraryFiltersProps {
  filters: ItineraryFilters;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function ItineraryFiltersSection({
  filters,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: ItineraryFiltersProps) {
  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== "ALL";

  return (
    <section className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Find Itineraries
            </h2>
            <p className="text-xs text-muted-foreground">
              Search and filter your travel plans
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_240px]">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by itinerary, customer or destination..."
            className="h-11 w-full rounded-xl border border-border/70 bg-background/70 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Status filter */}
        <div>
          <select
            value={filters.status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-border/70 bg-background/70 px-3.5 text-sm text-foreground outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            aria-label="Filter itineraries by status"
          >
            {ITINERARY_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
