
"use client";

import {
  CalendarDays,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";

import type { ItineraryItemType } from "../../components/itinerary-types";

export interface DayActivity {
  type: ItineraryItemType;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  supplierName: string;
}

export interface ItineraryDayForm {
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  accommodation: string;
  items: DayActivity[];
}

interface DayItinerarySectionProps {
  startDate: string;
  days: ItineraryDayForm[];
  onChange: (days: ItineraryDayForm[]) => void;
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const textareaClass =
  "w-full resize-y rounded-lg border border-border bg-secondary px-3 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

export default function DayItinerarySection({
  startDate,
  days,
  onChange,
}: DayItinerarySectionProps) {
  const getDayDate = (dayNumber: number) => {
    if (!startDate) return "";

    const date = new Date(`${startDate}T00:00:00`);
    date.setDate(date.getDate() + dayNumber - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (value: string) => {
    if (!value) return "Date not selected";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "Date not selected";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const updateDay = (
    dayNumber: number,
    field: keyof ItineraryDayForm,
    value: string
  ) => {
    onChange(
      days.map((day) =>
        day.dayNumber === dayNumber
          ? { ...day, [field]: value }
          : day
      )
    );
  };

  const addDay = () => {
    const nextDayNumber = days.length + 1;

    onChange([
      ...days,
      {
        dayNumber: nextDayNumber,
        date: getDayDate(nextDayNumber),
        title: "",
        description: "",
        accommodation: "",
        items: [],
      },
    ]);
  };

  const removeDay = (dayNumber: number) => {
    const updatedDays = days
      .filter((day) => day.dayNumber !== dayNumber)
      .map((day, index) => ({
        ...day,
        dayNumber: index + 1,
      }));

    onChange(updatedDays);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">

      {/* Section Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Daily Itinerary
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Add the travel plan and activities for each day.
          </p>
        </div>

        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          {days.length} {days.length === 1 ? "day" : "days"}
        </span>
      </div>

      {/* Day Cards */}
      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day.dayNumber}
            className="overflow-hidden rounded-lg border border-border bg-background"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/40 px-3 py-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                  {day.dayNumber}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {day.title || `Day ${day.dayNumber}`}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(day.date)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeDay(day.dayNumber)}
                disabled={days.length <= 1}
                title="Remove day"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Day Details */}
            <div className="space-y-4 p-3 sm:p-4">

              {/* Title and Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-foreground">
                    Day Title
                  </label>

                  <input
                    type="text"
                    value={day.title}
                    onChange={(event) =>
                      updateDay(day.dayNumber, "title", event.target.value)
                    }
                    placeholder="e.g. Arrival in Colombo"
                    className={inputClass}
                    maxLength={150}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                    Travel Date
                  </label>

                  <input
                    type="date"
                    value={day.date}
                    onChange={(event) =>
                      updateDay(day.dayNumber, "date", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Daily Activities */}
              <div>
                <label className="mb-2 block text-xs font-medium text-foreground">
                  Daily Activities
                  <span className="ml-1 text-rose-500">*</span>
                </label>

                <textarea
                  value={day.description}
                  onChange={(event) =>
                    updateDay(
                      day.dayNumber,
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the activities for this day. Example: After breakfast, visit Sigiriya Rock Fortress, enjoy a traditional village lunch, and transfer to Kandy."
                  rows={4}
                  className={textareaClass}
                />

                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Write all sightseeing, meals, transport and activities in one description.
                </p>
              </div>

              {/* Accommodation */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  Accommodation
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  value={day.accommodation}
                  onChange={(event) =>
                    updateDay(
                      day.dayNumber,
                      "accommodation",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Hotel name, Kandy"
                  className={inputClass}
                  maxLength={200}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Day */}
      <button
        type="button"
        onClick={addDay}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-500/40 bg-blue-500/5 text-sm font-semibold text-blue-400 transition hover:border-blue-500/70 hover:bg-blue-500/10"
      >
        <Plus className="h-4 w-4" />
        Add Another Day
      </button>
    </section>
  );
}
