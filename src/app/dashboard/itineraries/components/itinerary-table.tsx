
"use client";

import {
  CalendarDays,
  Eye,
  MapPin,
  Users,
} from "lucide-react";

import type { ItineraryRecord } from "./itinerary-types";

import {
  calculateItineraryDuration,
  formatItineraryDate,
  getCustomerFullName,
  getGuestCount,
} from "./itinerary-types";

import ItineraryStatusBadge from "./itinerary-status-badge";

interface ItineraryTableProps {
  itineraries: ItineraryRecord[];
  loading?: boolean;
  onView: (itinerary: ItineraryRecord) => void;
}

export default function ItineraryTable({
  itineraries,
  loading = false,
  onView,
}: ItineraryTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm">
        <div className="space-y-4 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse items-center gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>
              <div className="h-7 w-20 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-2 border-b border-border/60 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            All Itineraries
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage and review your travel plans
          </p>
        </div>

        <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          {itineraries.length}{" "}
          {itineraries.length === 1 ? "itinerary" : "itineraries"}
        </span>
      </div>

      {itineraries.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No itineraries available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Itinerary
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Travel Dates
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Guests
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
              {itineraries.map((itinerary) => {
                const duration = calculateItineraryDuration(
                  itinerary.startDate,
                  itinerary.endDate
                );

                return (
                  <tr
                    key={itinerary.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    {/* Itinerary information */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-foreground">
                            {itinerary.title}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {itinerary.referenceCode || "No reference"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {itinerary.days?.length ??
                              itinerary._count?.days ??
                              0}{" "}
                            days planned
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {getCustomerFullName(itinerary.customer) || "—"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {itinerary.customer.email || "No email"}
                      </p>
                    </td>

                    {/* Travel dates */}
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm font-medium text-foreground">
                        {formatItineraryDate(itinerary.startDate)}
                      </p>

                      <p className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                        to {formatItineraryDate(itinerary.endDate)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {duration} {duration === 1 ? "day" : "days"}
                      </p>
                    </td>

                    {/* Guests */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {getGuestCount(itinerary)}
                      </div>

                      <p className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                        {itinerary.adults} Adults
                        {itinerary.children > 0 &&
                          `, ${itinerary.children} Children`}
                        {itinerary.infants > 0 &&
                          `, ${itinerary.infants} Infants`}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <ItineraryStatusBadge status={itinerary.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onView(itinerary)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-500"
                        aria-label={`View ${itinerary.title}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border/60 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {itineraries.length} itineraries
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          Travel management
        </div>
      </div>
    </section>
  );
}
