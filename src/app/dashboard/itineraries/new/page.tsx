
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import CreateItineraryHeader from "./components/create-itinerary-header";
import BasicInformationSection from "./components/basic-information-section";
import DayItinerarySection, {
  type ItineraryDayForm,
} from "./components/day-itinerary-section";
import AdditionalDetailsSection, {
  type AdditionalDetails,
} from "./components/additional-details-section";
import FormActionsSection from "./components/form-actions-section";

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

const INITIAL_BASIC_INFORMATION: BasicInformation = {
  customerId: "",
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  adults: 1,
  children: 0,
  infants: 0,
  referenceCode: "",
};

const INITIAL_ADDITIONAL_DETAILS: AdditionalDetails = {
  description: "",
  inclusions: "",
  exclusions: "",
  notes: "",
};

const INITIAL_DAY: ItineraryDayForm = {
  dayNumber: 1,
  date: "",
  title: "",
  description: "",
  accommodation: "",
  items: [],
};

export default function NewItineraryPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [basicInfo, setBasicInfo] = useState<BasicInformation>(
    INITIAL_BASIC_INFORMATION
  );
  const [days, setDays] = useState<ItineraryDayForm[]>([
    INITIAL_DAY,
  ]);
  const [additionalDetails, setAdditionalDetails] =
    useState<AdditionalDetails>(INITIAL_ADDITIONAL_DETAILS);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load agency customers and form options.
  const loadFormOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "/api/itineraries/form-options",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load itinerary form information."
        );
      }

      setCustomers(
        Array.isArray(data.customers) ? data.customers : []
      );
    } catch (err) {
      console.error("Form options error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the form information."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFormOptions();
  }, [loadFormOptions]);

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

  // Validate the form.
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

  // Create itinerary.
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

      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create the itinerary."
        );
      }

      router.push("/dashboard/itineraries");
      router.refresh();
    } catch (err) {
      console.error("Create itinerary error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the itinerary."
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

      <CreateItineraryHeader />

      {/* Error message */}
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

      {/* Loading state */}
      {isLoading ? (
        <div className="rounded-xl border border-[#1E293B] bg-[#050914] px-5 py-12 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#1760F5]" />

          <p className="mt-4 text-sm font-medium text-[#E2E8F0]">
            Loading itinerary form...
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            Preparing your agency information and customers.
          </p>
        </div>
      ) : (
        <>
          {/* Basic information */}
          <BasicInformationSection
            customers={customers}
            values={basicInfo}
            onChange={handleBasicInfoChange}
          />

          {/* Daily itinerary */}
          <DayItinerarySection
            startDate={basicInfo.startDate}
            days={days}
            onChange={setDays}
          />

          {/* Additional information */}
          <AdditionalDetailsSection
            values={additionalDetails}
            onChange={handleAdditionalDetailsChange}
          />

          {/* Form actions */}
          <FormActionsSection
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
