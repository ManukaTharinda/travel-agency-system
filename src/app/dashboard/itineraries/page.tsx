
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

import ItineraryHeader from "./components/itinerary-header";
import ItineraryStatisticsSection from "./components/itinerary-statistics";
import ItineraryFiltersSection from "./components/itinerary-filters";
import ItineraryTable from "./components/itinerary-table";
import ItineraryEmptyState from "./components/itinerary-empty-state";

import {
  DEFAULT_ITINERARY_STATISTICS,
  type ItineraryFilters,
  type ItineraryRecord,
  type ItineraryStatistics,
} from "./components/itinerary-types";

export default function ItinerariesPage() {
  const router = useRouter();

  const [itineraries, setItineraries] = useState<ItineraryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ItineraryFilters>({
    search: "",
    status: "ALL",
  });

  const fetchItineraries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/itineraries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load itineraries.");
      }

      setItineraries(
        Array.isArray(data.itineraries) ? data.itineraries : []
      );
    } catch (err) {
      console.error("Fetch itineraries error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading itineraries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  // Calculate statistics from all itineraries.
  const statistics: ItineraryStatistics = useMemo(() => {
    return itineraries.reduce(
      (result, itinerary) => {
        result.total += 1;

        switch (itinerary.status) {
          case "DRAFT":
            result.draft += 1;
            break;
          case "READY":
            result.ready += 1;
            break;
          case "SENT":
            result.sent += 1;
            break;
          case "CONFIRMED":
            result.confirmed += 1;
            break;
          case "CANCELLED":
            result.cancelled += 1;
            break;
        }

        return result;
      },
      { ...DEFAULT_ITINERARY_STATISTICS }
    );
  }, [itineraries]);

  // Search and status filtering.
  const filteredItineraries = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    return itineraries.filter((itinerary) => {
      const customerName = [
        itinerary.customer?.firstName,
        itinerary.customer?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchTerm ||
        itinerary.title.toLowerCase().includes(searchTerm) ||
        (itinerary.destination || "").toLowerCase().includes(searchTerm) ||
        (itinerary.referenceCode || "").toLowerCase().includes(searchTerm) ||
        customerName.includes(searchTerm);

      const matchesStatus =
        filters.status === "ALL" ||
        itinerary.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [itineraries, filters]);

  const handleSearchChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      status: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
    });
  };

  const handleViewItinerary = (itinerary: ItineraryRecord) => {
    router.push(`/dashboard/itineraries/${itinerary.id}`);
  };

  const hasActiveFilters =
    filters.search.trim().length > 0 || filters.status !== "ALL";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 pb-8">

      {/* Page Header */}
      <ItineraryHeader />

      {/* Statistics */}
      <ItineraryStatisticsSection
        statistics={statistics}
        loading={loading}
      />

      {/* Search and Filters */}
      <ItineraryFiltersSection
        filters={filters}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

            <div>
              <p className="text-sm font-semibold text-foreground">
                Unable to load itineraries
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchItineraries}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* Itinerary Listing */}
      {!error && (
        <section>
          {filteredItineraries.length === 0 && !loading ? (
            <ItineraryEmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <ItineraryTable
              itineraries={filteredItineraries}
              loading={loading}
              onView={handleViewItinerary}
            />
          )}
        </section>
      )}

    </div>
  );
}
