
import {
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  XCircle,
} from "lucide-react";

import type { ItineraryStatus } from "./itinerary-types";

interface ItineraryStatusBadgeProps {
  status: ItineraryStatus;
}

const STATUS_CONFIG: Record<
  ItineraryStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  DRAFT: {
    label: "Draft",
    className: "border-slate-500/20 bg-slate-500/10 text-slate-500",
    icon: FileText,
  },
  READY: {
    label: "Ready",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    icon: CheckCircle2,
  },
  SENT: {
    label: "Sent",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-500",
    icon: Send,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-500",
    icon: XCircle,
  },
};

export default function ItineraryStatusBadge({
  status,
}: ItineraryStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
