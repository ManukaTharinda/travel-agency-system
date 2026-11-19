
"use client";

import { CalendarDays, UserRound, MapPin } from "lucide-react";

import type {
  DocumentCustomer,
  DocumentItinerary,
} from "./document-types";

interface QuotationCustomerSectionProps {
  customers: DocumentCustomer[];
  itineraries: DocumentItinerary[];
  customerId: string;
  itineraryId: string;
  issueDate: string;
  validUntil: string;
  onCustomerChange: (value: string) => void;
  onItineraryChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onValidUntilChange: (value: string) => void;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const labelClass =
  "text-sm font-medium text-slate-700 dark:text-slate-300";

export default function QuotationCustomerSection({
  customers,
  itineraries,
  customerId,
  itineraryId,
  issueDate,
  validUntil,
  onCustomerChange,
  onItineraryChange,
  onIssueDateChange,
  onValidUntilChange,
}: QuotationCustomerSectionProps) {
  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId
  );

  const filteredItineraries = itineraries.filter(
    (itinerary) => itinerary.customerId === customerId
  );

  const selectedItinerary = filteredItineraries.find(
    (itinerary) => itinerary.id === itineraryId
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <UserRound size={18} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Customer & Trip Details
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Select the customer and travel itinerary for this quotation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            Customer <span className="text-red-500">*</span>
          </label>

          <select
            value={customerId}
            onChange={(event) => onCustomerChange(event.target.value)}
            className={inputClass}
            required
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
              No active customers found. Add a customer before creating a quotation.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Related Itinerary
          </label>

          <select
            value={itineraryId}
            onChange={(event) => onItineraryChange(event.target.value)}
            className={inputClass}
            disabled={!customerId || filteredItineraries.length === 0}
          >
            <option value="">No itinerary selected</option>

            {filteredItineraries.map((itinerary) => (
              <option key={itinerary.id} value={itinerary.id}>
                {itinerary.title}
                {itinerary.referenceCode
                  ? ` (${itinerary.referenceCode})`
                  : ""}
              </option>
            ))}
          </select>

          {customerId && filteredItineraries.length === 0 && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              No itineraries are available for this customer.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} />
              Issue Date
            </span>
          </label>

          <input
            type="date"
            value={issueDate}
            onChange={(event) => onIssueDateChange(event.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} />
              Valid Until
            </span>
          </label>

          <input
            type="date"
            value={validUntil}
            min={issueDate || undefined}
            onChange={(event) => onValidUntilChange(event.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      {selectedCustomer && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Selected Customer
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {selectedCustomer.firstName} {selectedCustomer.lastName ?? ""}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            {selectedCustomer.email && (
              <span>{selectedCustomer.email}</span>
            )}

            {selectedCustomer.phone && (
              <span>{selectedCustomer.phone}</span>
            )}

            {selectedCustomer.nationality && (
              <span>{selectedCustomer.nationality}</span>
            )}
          </div>
        </div>
      )}

      {selectedItinerary && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200/70 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
          <MapPin size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {selectedItinerary.title}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {selectedItinerary.destination || "Destination not specified"}
            </p>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {new Date(selectedItinerary.startDate).toLocaleDateString()} –{" "}
              {new Date(selectedItinerary.endDate).toLocaleDateString()}
              {" · "}
              {selectedItinerary.adults} Adults
              {selectedItinerary.children > 0 &&
                ` · ${selectedItinerary.children} Children`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
