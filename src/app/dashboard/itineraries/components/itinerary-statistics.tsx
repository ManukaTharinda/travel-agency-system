
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  XCircle,
} from "lucide-react";

import type { ItineraryStatistics } from "./itinerary-types";

interface ItineraryStatisticsProps {
  statistics: ItineraryStatistics;
  loading?: boolean;
}

export default function ItineraryStatisticsSection({
  statistics,
  loading = false,
}: ItineraryStatisticsProps) {
  const cards = [
    {
      label: "Total Itineraries",
      value: statistics.total,
      icon: CalendarDays,
      iconStyle: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Draft",
      value: statistics.draft,
      icon: FileText,
      iconStyle: "bg-slate-500/10 text-slate-500",
    },
    {
      label: "Ready",
      value: statistics.ready,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Sent",
      value: statistics.sent,
      icon: Send,
      iconStyle: "bg-violet-500/10 text-violet-500",
    },
    {
      label: "Confirmed",
      value: statistics.confirmed,
      icon: Clock3,
      iconStyle: "bg-cyan-500/10 text-cyan-500",
    },
    {
      label: "Cancelled",
      value: statistics.cancelled,
      icon: XCircle,
      iconStyle: "bg-rose-500/10 text-rose-500",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Overview
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          A quick summary of your travel itineraries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="group rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>

                  {loading ? (
                    <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-muted" />
                  ) : (
                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                      {card.value.toLocaleString()}
                    </p>
                  )}
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
