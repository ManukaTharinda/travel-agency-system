
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import BasicInformationSection from "../../new/components/basic-information-section";
import DayItinerarySection, {
  type ItineraryDayForm,
  type DayActivity,
} from "../../new/components/day-itinerary-section";
import AdditionalDetailsSection, {
  type AdditionalDetails,
} from "../../new/components/additional-details-section";

interface CustomerOption {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality?: string | null;
}

interface BasicInformation {
  customerId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  referenceCode: string;
}

interface ItineraryResponse {
  id: string;
  customerId: string;
  referenceCode: string | null;
  title: string;
  destination: string | null;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  description: string | null;
  inclusions: string | null;
  exclusions: string | null;
  notes: string | null;
  days: {
    dayNumber: number;
    date: string | null;
    title: string | null;
    description: string | null;
    accommodation: string | null;
    items: {
      type: string;
      title: string;
      description: string | null;
      location: string | null;
      startTime: string | null;
      endTime: string | null;
      supplierName: string | null;
      sortOrder: number;
    }[];
  }[];
}

const inputClass =
  "h-10 w-full rounded-lg border border-[#1E293B] bg-[#10192D] px-3 text-sm text-[#F8FAFC] outline-none transition focus:border-blue-500";

function formatDate(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function EditItineraryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const itineraryId = params.id;

  const [customers, setCustomers] = useState<CustomerOption[]>([]);

  const [basicInfo, setBasicInfo] = useState<BasicInformation>({
    customerId: "",
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    referenceCode: "",
  });

  const [days, setDays] = useState<ItineraryDayForm[]>([]);

  const [additionalDetails, setAdditionalDetails] =
    useState<AdditionalDetails>({
      description: "",
      inclusions: "",
      exclusions: "",
      notes: "",
    });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing itinerary and agency customers.
  const loadItinerary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const [itineraryResponse, optionsResponse] = await Promise.all([
        fetch(`/api/itineraries/${itineraryId}`, {
          cache: "no-store",
        }),
        fetch("/api/itineraries/form-options", {
          cache: "no-store",
        }),
      ]);

      const itineraryData = await itineraryResponse.json();
      const optionsData = await optionsResponse.json();

      if (!itineraryResponse.ok) {
        throw new Error(
          itineraryData.error || "Failed to load itinerary."
        );
      }

      if (!optionsResponse.ok) {
        throw new Error(
          optionsData.error || "Failed to load customers."
        );
      }

      const itinerary: ItineraryResponse =
        itineraryData.itinerary;

      if (!itinerary) {
        throw new Error("Itinerary information was not found.");
      }

      setCustomers(
        Array.isArray(optionsData.customers)
          ? optionsData.customers
          : []
      );

      // Populate basic information.
      setBasicInfo({
        customerId: itinerary.customerId,
        title: itinerary.title || "",
        destination: itinerary.destination || "",
        startDate: formatDate(itinerary.startDate),
        endDate: formatDate(itinerary.endDate),
        adults: itinerary.adults ?? 1,
        children: itinerary.children ?? 0,
        infants: itinerary.infants ?? 0,
        referenceCode: itinerary.referenceCode || "",
      });

      // Populate daily itinerary.
      setDays(
        (itinerary.days || [])
          .sort((a, b) => a.dayNumber - b.dayNumber)
          .map((day, index) => ({
            dayNumber: day.dayNumber || index + 1,
            date: formatDate(day.date),
            title: day.title || "",
            description: day.description || "",
            accommodation: day.accommodation || "",
            items: (day.items || []).map((item) => ({
              type: item.type as DayActivity["type"],
              title: item.title || "",
              description: item.description || "",
              location: item.location || "",
              startTime: item.startTime || "",
              endTime: item.endTime || "",
              supplierName: item.supplierName || "",
            })),
          }))
      );

      // Populate additional details.
      setAdditionalDetails({
        description: itinerary.description || "",
        inclusions: itinerary.inclusions || "",
        exclusions: itinerary.exclusions || "",
        notes: itinerary.notes || "",
      });
    } catch (err) {
      console.error("Load itinerary error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load itinerary information."
      );
    } finally {
      setIsLoading(false);
    }
  }, [itineraryId]);

  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  // Update basic information.
  const handleBasicInfoChange = (
    field: keyof BasicInformation,
    value: string | number
  ) => {
    setBasicInfo((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Update additional details.
  const handleAdditionalDetailsChange = (
    field: keyof AdditionalDetails,
    value: string
  ) => {
    setAdditionalDetails((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Validate form.
  const validateForm = () => {
    if (!basicInfo.customerId) {
      return "Please select a customer.";
    }

    if (!basicInfo.title.trim()) {
      return "Please enter an itinerary title.";
    }

    if (!basicInfo.destination.trim()) {
      return "Please enter the destination.";
    }

    if (!basicInfo.startDate || !basicInfo.endDate) {
      return "Please select the travel start and end dates.";
    }

    if (basicInfo.endDate < basicInfo.startDate) {
      return "The end date cannot be before the start date.";
    }

    if (basicInfo.adults < 1) {
      return "At least one adult is required.";
    }

    if (days.length === 0) {
      return "Please add at least one itinerary day.";
    }

    return "";
  };

  // Save itinerary changes.
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        customerId: basicInfo.customerId,
        referenceCode: basicInfo.referenceCode.trim() || null,
        title: basicInfo.title.trim(),
        destination: basicInfo.destination.trim(),
        startDate: basicInfo.startDate,
        endDate: basicInfo.endDate,
        adults: basicInfo.adults,
        children: basicInfo.children,
        infants: basicInfo.infants,

        description: additionalDetails.description.trim(),
        inclusions: additionalDetails.inclusions.trim(),
        exclusions: additionalDetails.exclusions.trim(),
        notes: additionalDetails.notes.trim(),

        days: days.map((day) => ({
          dayNumber: day.dayNumber,
          date: day.date || null,
          title: day.title.trim(),
          description: day.description.trim(),
          accommodation: day.accommodation.trim(),

          items: day.items.map((item) => ({
            type: item.type,
            title: item.title.trim(),
            description: item.description.trim(),
            location: item.location.trim(),
            startTime: item.startTime || null,
            endTime: item.endTime || null,
            supplierName: item.supplierName.trim(),
          })),
        })),
      };

      const response = await fetch(
        `/api/itineraries/${itineraryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update itinerary."
        );
      }

      router.push(`/dashboard/itineraries/${itineraryId}`);
      router.refresh();
    } catch (err) {
      console.error("Update itinerary error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the itinerary."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-3 pb-10 sm:px-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(`/dashboard/itineraries/${itineraryId}`)
            }
            className="mb-3 flex items-center gap-2 text-xs font-medium text-[#94A3B8] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Itinerary
          </button>

          <h1 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
            Edit Itinerary
          </h1>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Update your travel details and daily itinerary.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

          <div>
            <p className="text-sm font-semibold text-rose-400">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-[#94A3B8]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-xl border border-[#1E293B] bg-[#050914] px-5 py-12 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#1760F5]" />

          <p className="mt-4 text-sm font-medium text-[#E2E8F0]">
            Loading itinerary...
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            Preparing your saved travel information.
          </p>
        </div>
      ) : (
        <>
          <BasicInformationSection
            customers={customers}
            values={basicInfo}
            onChange={handleBasicInfoChange}
          />

          <DayItinerarySection
            startDate={basicInfo.startDate}
            days={days}
            onChange={setDays}
          />

          <AdditionalDetailsSection
            values={additionalDetails}
            onChange={handleAdditionalDetailsChange}
          />

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#1E293B] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                router.push(`/dashboard/itineraries/${itineraryId}`)
              }
              className="h-10 rounded-lg border border-[#1E293B] px-5 text-sm font-medium text-[#CBD5E1] transition hover:bg-[#10192D] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1760F5] px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
