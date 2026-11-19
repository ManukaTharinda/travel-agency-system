
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  StickyNote,
  Hotel,
  Clock,
  Car,
  Utensils,
  Map,
  Loader2,
  RefreshCw,
  AlertCircle,
  DollarSign,
  UserRound,
} from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
}

interface ItineraryItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
  supplierName: string | null;
}

interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string | null;
  title: string | null;
  description: string | null;
  accommodation: string | null;
  items: ItineraryItem[];
}

interface PriceItem {
  id: string;
  category: string;
  name: string;
  description: string | null;
  quantity: string | number;
  unitCost: string | number;
  unitSellingPrice: string | number;
  currencyCode: string;
}

interface Itinerary {
  id: string;
  referenceCode: string | null;
  title: string;
  destination: string | null;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  status: string;
  description: string | null;
  inclusions: string | null;
  exclusions: string | null;
  notes: string | null;
  customer: Customer;
  days: ItineraryDay[];
  priceItems: PriceItem[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  READY: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  SENT: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  CONFIRMED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  CANCELLED:
    "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

const ITEM_ICONS: Record<string, typeof Map> = {
  ACCOMMODATION: Hotel,
  ACTIVITY: Map,
  TRANSPORT: Car,
  MEAL: Utensils,
  OTHER: FileText,
};

function formatDate(value: string | null) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatMoney(
  value: string | number,
  currencyCode: string
) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          <Icon className="h-4 w-4" />
        </div>

        <h2 className="text-sm font-semibold text-[#F8FAFC]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InformationField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[#64748B]">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-[#E2E8F0]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function TextInformation({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | null;
  icon: typeof FileText;
}) {
  if (!value?.trim()) return null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-400" />

        <h3 className="text-sm font-medium text-[#E2E8F0]">
          {title}
        </h3>
      </div>

      <p className="whitespace-pre-line text-sm leading-6 text-[#94A3B8]">
        {value}
      </p>
    </div>
  );
}

export default function ItineraryDetailsPage() {
  const params = useParams<{ id: string }>();
  const itineraryId = params.id;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItinerary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/itineraries/${encodeURIComponent(itineraryId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load itinerary details."
        );
      }

      setItinerary(data.itinerary);
    } catch (err) {
      console.error("Fetch itinerary details error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the itinerary."
      );
    } finally {
      setLoading(false);
    }
  }, [itineraryId]);

  useEffect(() => {
    if (itineraryId) {
      fetchItinerary();
    }
  }, [itineraryId, fetchItinerary]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1760F5]" />

        <p className="mt-4 text-sm text-[#94A3B8]">
          Loading itinerary details...
        </p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <Link
          href="/dashboard/itineraries"
          className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Itineraries
        </Link>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
          <AlertCircle className="h-7 w-7 text-rose-400" />

          <h2 className="mt-3 text-base font-semibold text-[#F8FAFC]">
            Unable to load itinerary
          </h2>

          <p className="mt-2 text-sm text-[#94A3B8]">
            {error || "The requested itinerary could not be found."}
          </p>

          <button
            type="button"
            onClick={fetchItinerary}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1760F5] px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const customerName = [
    itinerary.customer?.firstName,
    itinerary.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const totalGuests =
    itinerary.adults + itinerary.children + itinerary.infants;

  const totalCost = itinerary.priceItems.reduce(
    (total, item) =>
      total + Number(item.quantity) * Number(item.unitCost),
    0
  );

  const totalSellingPrice = itinerary.priceItems.reduce(
    (total, item) =>
      total +
      Number(item.quantity) * Number(item.unitSellingPrice),
    0
  );

  const currencyCode =
    itinerary.priceItems[0]?.currencyCode || "LKR";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-10">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/itineraries"
            className="mb-3 inline-flex items-center gap-2 text-xs text-[#94A3B8] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Itineraries
          </Link>

          <h1 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
            {itinerary.title}
          </h1>

          <p className="mt-1 text-xs text-[#64748B]">
            {itinerary.referenceCode || "No reference number"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/dashboard/itineraries/${itinerary.id}/edit`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#1760F5] px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Edit Itinerary
          </Link>

          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
              STATUS_STYLES[itinerary.status] || STATUS_STYLES.DRAFT
            }`}
          >
            {itinerary.status}
          </span>
        </div>
      </div>

      {/* Travel Overview */}
      <section className="rounded-xl border border-[#1E293B] bg-[#050914] p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <InformationField
            label="Destination"
            value={itinerary.destination || "Not specified"}
          />

          <InformationField
            label="Start Date"
            value={formatDate(itinerary.startDate)}
          />

          <InformationField
            label="End Date"
            value={formatDate(itinerary.endDate)}
          />

          <InformationField
            label="Total Guests"
            value={`${totalGuests} Guests`}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#1E293B] pt-4">
          <div>
            <p className="text-xs text-[#64748B]">Adults</p>
            <p className="mt-1 text-lg font-semibold text-[#F8FAFC]">
              {itinerary.adults}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#64748B]">Children</p>
            <p className="mt-1 text-lg font-semibold text-[#F8FAFC]">
              {itinerary.children}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#64748B]">Infants</p>
            <p className="mt-1 text-lg font-semibold text-[#F8FAFC]">
              {itinerary.infants}
            </p>
          </div>
        </div>
      </section>

      {/* Customer Information */}
      <SectionCard title="Customer Information" icon={UserRound}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InformationField
            label="Customer Name"
            value={customerName}
          />

          <InformationField
            label="Email Address"
            value={itinerary.customer?.email || ""}
          />

          <InformationField
            label="Phone Number"
            value={itinerary.customer?.phone || ""}
          />

          <InformationField
            label="Nationality"
            value={itinerary.customer?.nationality || ""}
          />
        </div>
      </SectionCard>

      {/* Daily Itinerary */}
      <SectionCard title="Daily Itinerary" icon={CalendarDays}>
        {itinerary.days.length === 0 ? (
          <p className="text-sm text-[#64748B]">
            No daily itinerary information available.
          </p>
        ) : (
          <div className="space-y-4">
            {itinerary.days.map((day) => (
              <div
                key={day.id}
                className="rounded-lg border border-[#1E293B] bg-[#080F1E] p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                      Day {day.dayNumber}
                    </p>

                    <h3 className="mt-1 text-sm font-semibold text-[#F8FAFC]">
                      {day.title || `Day ${day.dayNumber}`}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(day.date)}
                  </span>
                </div>

                {day.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#94A3B8]">
                    {day.description}
                  </p>
                )}

                {day.accommodation && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#1E293B] bg-[#10192D] p-3">
                    <Hotel className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                    <div>
                      <p className="text-xs font-medium text-[#E2E8F0]">
                        Accommodation
                      </p>

                      <p className="mt-1 text-sm text-[#94A3B8]">
                        {day.accommodation}
                      </p>
                    </div>
                  </div>
                )}

                {day.items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-[#94A3B8]">
                      Activities
                    </p>

                    {day.items.map((item) => {
                      const ItemIcon =
                        ITEM_ICONS[item.type] || FileText;

                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 rounded-lg border border-[#1E293B]/70 bg-[#050914] p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                            <ItemIcon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-[#E2E8F0]">
                                {item.title}
                              </p>

                              <span className="rounded-md bg-[#10192D] px-2 py-0.5 text-[10px] text-[#94A3B8]">
                                {item.type.replaceAll("_", " ")}
                              </span>
                            </div>

                            {item.description && (
                              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                                {item.description}
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                              {item.location && (
                                <span className="flex items-center gap-1 text-xs text-[#64748B]">
                                  <MapPin className="h-3 w-3" />
                                  {item.location}
                                </span>
                              )}

                              {(item.startTime || item.endTime) && (
                                <span className="flex items-center gap-1 text-xs text-[#64748B]">
                                  <Clock className="h-3 w-3" />
                                  {item.startTime || ""}
                                  {item.startTime && item.endTime
                                    ? " - "
                                    : ""}
                                  {item.endTime || ""}
                                </span>
                              )}
                            </div>

                            {item.supplierName && (
                              <p className="mt-2 text-xs text-[#64748B]">
                                Supplier: {item.supplierName}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Additional Information */}
      <SectionCard title="Additional Information" icon={FileText}>
        <div className="space-y-5">
          <TextInformation
            title="Itinerary Description"
            value={itinerary.description}
            icon={FileText}
          />

          <TextInformation
            title="What's Included"
            value={itinerary.inclusions}
            icon={CheckCircle2}
          />

          <TextInformation
            title="What's Not Included"
            value={itinerary.exclusions}
            icon={XCircle}
          />

          <TextInformation
            title="Internal Notes"
            value={itinerary.notes}
            icon={StickyNote}
          />

          {!itinerary.description &&
            !itinerary.inclusions &&
            !itinerary.exclusions &&
            !itinerary.notes && (
              <p className="text-sm text-[#64748B]">
                No additional information available.
              </p>
            )}
        </div>
      </SectionCard>

      {/* Pricing */}
      <SectionCard title="Pricing Information" icon={DollarSign}>
        {itinerary.priceItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#334155] p-6 text-center">
            <DollarSign className="mx-auto h-7 w-7 text-[#64748B]" />

            <p className="mt-2 text-sm font-medium text-[#E2E8F0]">
              No pricing items yet
            </p>

            <p className="mt-1 text-xs text-[#64748B]">
              Pricing items can be added in a future pricing management feature.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-[#1E293B] text-xs text-[#64748B]">
                    <th className="px-3 py-3 font-medium">Item</th>
                    <th className="px-3 py-3 font-medium">Category</th>
                    <th className="px-3 py-3 text-right font-medium">
                      Quantity
                    </th>
                    <th className="px-3 py-3 text-right font-medium">
                      Unit Cost
                    </th>
                    <th className="px-3 py-3 text-right font-medium">
                      Selling Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {itinerary.priceItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#1E293B]/70 text-sm last:border-0"
                    >
                      <td className="px-3 py-3">
                        <p className="font-medium text-[#E2E8F0]">
                          {item.name}
                        </p>

                        {item.description && (
                          <p className="mt-1 text-xs text-[#64748B]">
                            {item.description}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-3 text-xs text-[#94A3B8]">
                        {item.category}
                      </td>

                      <td className="px-3 py-3 text-right text-[#E2E8F0]">
                        {Number(item.quantity)}
                      </td>

                      <td className="px-3 py-3 text-right text-[#94A3B8]">
                        {formatMoney(item.unitCost, item.currencyCode)}
                      </td>

                      <td className="px-3 py-3 text-right font-medium text-[#E2E8F0]">
                        {formatMoney(
                          item.unitSellingPrice,
                          item.currencyCode
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid gap-3 border-t border-[#1E293B] pt-4 sm:grid-cols-2">
              <div className="rounded-lg bg-[#10192D] p-4">
                <p className="text-xs text-[#94A3B8]">
                  Total Agency Cost
                </p>

                <p className="mt-1 text-lg font-semibold text-[#E2E8F0]">
                  {formatMoney(totalCost, currencyCode)}
                </p>
              </div>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-[#94A3B8]">
                  Total Selling Price
                </p>

                <p className="mt-1 text-lg font-semibold text-blue-400">
                  {formatMoney(totalSellingPrice, currencyCode)}
                </p>
              </div>
            </div>
          </>
        )}
      </SectionCard>

      {/* Record Information */}
      <div className="flex flex-col gap-2 border-t border-[#1E293B] pt-4 text-xs text-[#64748B] sm:flex-row sm:justify-between">
        <p>Created: {formatDate(itinerary.createdAt)}</p>
        <p>Last updated: {formatDate(itinerary.updatedAt)}</p>
      </div>
    </div>
  );
}
