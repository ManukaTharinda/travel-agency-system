
export type ItineraryStatus =
  | "DRAFT"
  | "READY"
  | "SENT"
  | "CONFIRMED"
  | "CANCELLED";

export type ItineraryItemType =
  | "ACCOMMODATION"
  | "ACTIVITY"
  | "TRANSPORT"
  | "MEAL"
  | "OTHER";

export interface ItineraryCustomer {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality?: string | null;
}

export interface ItineraryActivity {
  id: string;
  type: ItineraryItemType;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
  supplierName: string | null;
  sortOrder: number;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string | null;
  title: string | null;
  description: string | null;
  accommodation: string | null;
  items: ItineraryActivity[];
}

export interface ItineraryRecord {
  id: string;
  referenceCode: string | null;
  title: string;
  destination: string | null;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  status: ItineraryStatus;
  description?: string | null;
  inclusions?: string | null;
  exclusions?: string | null;
  notes?: string | null;
  customer: ItineraryCustomer;
  days?: ItineraryDay[];
  _count?: { days: number };
  updatedAt: string;
  createdAt?: string;
}

export interface ItineraryStatistics {
  total: number;
  draft: number;
  ready: number;
  sent: number;
  confirmed: number;
  cancelled: number;
}

export interface ItineraryFilters {
  search: string;
  status: string;
}

export const ITINERARY_STATUS_OPTIONS = [
  { label: "All Itineraries", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Ready", value: "READY" },
  { label: "Sent", value: "SENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

export const ITINERARY_ITEM_TYPE_OPTIONS = [
  { label: "Accommodation", value: "ACCOMMODATION" },
  { label: "Activity", value: "ACTIVITY" },
  { label: "Transportation", value: "TRANSPORT" },
  { label: "Meal", value: "MEAL" },
  { label: "Other", value: "OTHER" },
] as const;

export const DEFAULT_ITINERARY_STATISTICS: ItineraryStatistics = {
  total: 0,
  draft: 0,
  ready: 0,
  sent: 0,
  confirmed: 0,
  cancelled: 0,
};

export function getCustomerFullName(
  customer: ItineraryCustomer
): string {
  return [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");
}

export function getGuestCount(
  itinerary: ItineraryRecord
): number {
  return itinerary.adults +
    itinerary.children +
    itinerary.infants;
}

export function formatItineraryDate(
  value: string | Date
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function calculateItineraryDuration(
  startDate: string,
  endDate: string
): number {
  const start = new Date(`${startDate.slice(0, 10)}T00:00:00Z`);
  const end = new Date(`${endDate.slice(0, 10)}T00:00:00Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 0;
  }

  return Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
}
