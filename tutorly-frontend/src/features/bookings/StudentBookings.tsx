"use client";

import { useGetBookingsQuery } from "@/features/bookings/bookingApi";
import CancelBookingButton from "./CancelBookingButton";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Booking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  scheduledAt: string;
  tutor?: { name?: string; image?: string };
};

const STATUS_CONFIG: Record<
  string,
  { label: string; accent: string; dot: string; badge: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    accent: "border-l-indigo-400",
    dot: "bg-indigo-400",
    badge: "text-indigo-600 bg-indigo-50",
  },
  COMPLETED: {
    label: "Completed",
    accent: "border-l-emerald-400",
    dot: "bg-emerald-400",
    badge: "text-emerald-700 bg-emerald-50",
  },
  CANCELLED: {
    label: "Cancelled",
    accent: "border-l-stone-300",
    dot: "bg-stone-300",
    badge: "text-stone-400 bg-stone-100",
  },
};

const STATUS_ORDER = ["CONFIRMED", "COMPLETED", "CANCELLED"];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function BookingSkeleton() {
  return (
    <div className="bg-white border border-[#e5e3de] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const config = STATUS_CONFIG[booking.status] ?? {
    label: booking.status,
    accent: "border-l-stone-300",
    dot: "bg-stone-300",
    badge: "text-stone-500 bg-stone-50",
  };

  const isCancelled = booking.status === "CANCELLED";

  return (
    <div
      className={`bg-white border border-[#e5e3de] border-l-4 ${config.accent}
      rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4
      ${isCancelled ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {booking.tutor?.image ? (
          <img
            src={booking.tutor.image}
            alt={booking.tutor.name}
            className="w-10 h-10 rounded-full object-cover border border-[#e5e3de]"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-[#e5e3de]
          flex items-center justify-center text-xs font-medium text-indigo-600">
            {booking.tutor?.name ? getInitials(booking.tutor.name) : "?"}
          </div>
        )}

        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#1a1a18] truncate">
            {booking.tutor?.name ?? "Unknown tutor"}
          </p>
          <p className="text-xs text-[#6b6b66]">
            {formatDate(booking.scheduledAt)} · {formatTime(booking.scheduledAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto gap-3">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${config.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>

        {booking.status === "CONFIRMED" && (
          <CancelBookingButton id={booking.id} />
        )}
      </div>
    </div>
  );
}

function BookingGroup({
  status,
  bookings,
}: {
  status: string;
  bookings: Booking[];
}) {
  if (bookings.length === 0) return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-xs uppercase text-[#9e9c97]">
            {config.label}
          </span>
          <span className="text-xs text-[#c4c2bd]">
            {bookings.length}
          </span>
        </div>
        <div className="flex-1 h-px bg-[#e5e3de]" />
      </div>

      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}

export default function StudentBookings() {
  const { data, isLoading } = useGetBookingsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-52" />
        </div>
        {[1, 2, 3].map((i) => (
          <BookingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl">My sessions</h1>
        </div>

        <div className="bg-white border border-[#e5e3de] rounded-xl flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
          <div className="text-xl mb-3">📅</div>
          <p className="text-sm mb-2">No sessions yet</p>
          <Link
            href="/tutors"
            className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-md"
          >
            Browse tutors
          </Link>
        </div>
      </div>
    );
  }

  const grouped = STATUS_ORDER.reduce<Record<string, Booking[]>>(
    (acc, status) => {
      acc[status] = data.filter((b: Booking) => b.status === status);
      return acc;
    },
    {}
  );

  const confirmedCount = grouped["CONFIRMED"]?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-8 max-w-4xl mx-auto">

      <div>
        <h1 className="text-2xl sm:text-3xl">My sessions</h1>
        <p className="text-sm text-[#9e9c97] mt-1">
          {confirmedCount > 0
            ? `${confirmedCount} upcoming`
            : "No upcoming"}{" "}
          · {data.length} total
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {STATUS_ORDER.map((status) => (
          <BookingGroup
            key={status}
            status={status}
            bookings={grouped[status] ?? []}
          />
        ))}
      </div>
    </div>
  );
}