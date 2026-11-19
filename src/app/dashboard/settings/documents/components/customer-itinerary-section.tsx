
"use client";

import { UserRound, MapPin, CalendarDays } from "lucide-react";
import type {
  DocumentCustomer,
  DocumentItinerary,
} from "./document-types";

interface CustomerItinerarySectionProps {
  customers: DocumentCustomer[];
  itineraries: DocumentItinerary[];
  customerId: string;
  itineraryId: string;
  onCustomerChange: (value: string) => void;
  onItineraryChange: (value: string) => void;
  documentType: "quotation" | "invoice";
}

export function CustomerItinerarySection({
  customers,
  itineraries,
  customerId,
  itineraryId,
  onCustomerChange,
  onItineraryChange,
  documentType,
}: CustomerItinerarySectionProps) {
  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId
  );

  const selectedItinerary = itineraries.find(
    (itinerary) => itinerary.id === itineraryId
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Customer & Trip Details
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Select the customer and connect an existing travel itinerary.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Customer selection */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <UserRound className="h-4 w-4 text-blue-500" />
            Customer
            <span className="text-red-500">*</span>
          </label>

          <select
            value={customerId}
            onChange={(event) => onCustomerChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="">Select a customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName ?? ""}
                {customer.email ? ` — ${customer.email}` : ""}
              </option>
            ))}
          </select>

          {customers.length === 0 && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              No customers found. Add a customer before creating this document.
            </p>
          )}

          {selectedCustomer && (
            <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedCustomer.firstName}{" "}
                {selectedCustomer.lastName ?? ""}
              </p>

              {selectedCustomer.email && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedCustomer.email}
                </p>
              )}

              {selectedCustomer.phone && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedCustomer.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Itinerary selection */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <MapPin className="h-4 w-4 text-blue-500" />
            Travel Itinerary
            <span className="text-xs font-normal text-slate-400">
              (Optional)
            </span>
          </label>

          <select
            value={itineraryId}
            onChange={(event) => onItineraryChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="">No itinerary linked</option>

            {itineraries
              .filter(
                (itinerary) =>
                  !customerId || 
                  customers.some((customer) => customer.id === customerId)
              )
              .map((itinerary) => (
                <option key={itinerary.id} value={itinerary.id}>
                  {itinerary.title}
                  {itinerary.destination
                    ? ` — ${itinerary.destination}`
                    : ""}
                </option>
              ))}
          </select>

          {itineraries.length === 0 && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              No itineraries available. You can continue without linking one.
            </p>
          )}

          {selectedItinerary && (
            <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedItinerary.title}
              </p>

              {selectedItinerary.destination && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedItinerary.destination}
                </p>
              )}

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(selectedItinerary.startDate)} –{" "}
                {formatDate(selectedItinerary.endDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {documentType === "quotation" && (
        <p className="mt-5 rounded-xl border border-blue-200/70 bg-blue-50/70 p-3 text-xs leading-5 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-300">
          The selected customer and itinerary details will be used when
          preparing the quotation.
        </p>
      )}
    </section>
  );
}
