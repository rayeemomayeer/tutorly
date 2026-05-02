"use client";

import { useParams } from "next/navigation";
import { useGetTutorBookingsQuery } from "@/features/bookings/bookingApi";
import { useGetTutorByIdQuery } from "../tutors/tutorApi";
import CancelBookingButton from "./CancelBookingButton";
import CompleteBookingButton from "./CompleteBookingButton";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Booking = {
  id: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  scheduledAt: string;
  student?: { name?: string; image?: string };
};

const STATUS_CONFIG: Record<string, { label: string; accent: string; dot: string; badge: string }> = {
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function BookingSkeleton() {
  return (
    <div className="bg-white border border-[#e5e3de] border-l-4 border-l-[#e5e3de] rounded-xl px-4 sm:px-5 py-4 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full hidden sm:block" />
      <Skeleton className="h-8 w-24 rounded-md hidden md:block" />
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
      className={`group bg-white border border-[#e5e3de] border-l-4 ${config.accent}
                  rounded-xl px-4 sm:px-5 py-4
                  flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5
                  hover:shadow-sm transition-all duration-150
                  ${isCancelled ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {booking.student?.image ? (
          <img
            src={booking.student.image}
            alt={booking.student.name}
            className="w-10 h-10 rounded-full object-cover border border-[#e5e3de] shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-stone-100 border border-[#e5e3de]
                          flex items-center justify-center text-xs font-medium text-stone-500 shrink-0">
            {booking.student?.name ? getInitials(booking.student.name) : "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1a1a18] truncate">
            {booking.student?.name ?? "Unknown student"}
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="text-xs text-[#6b6b66] font-light">{formatDate(booking.scheduledAt)}</span>
            <span className="text-[#e5e3de] text-xs hidden sm:inline">·</span>
            <span className="text-xs text-[#6b6b66] font-light">{formatTime(booking.scheduledAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${config.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>

        {booking.status === "CONFIRMED" && (
          <div className="flex gap-2">
            <CancelBookingButton id={booking.id} />
            <CompleteBookingButton id={booking.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function BookingGroup({ status, bookings }: { status: string; bookings: Booking[] }) {
  if (bookings.length === 0) return null;

  const config = STATUS_CONFIG[status] ?? { label: status, dot: "bg-stone-300" };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
            {config.label}
          </span>
          <span className="text-[11px] text-[#c4c2bd]">{bookings.length}</span>
        </div>
        <div className="flex-1 h-px bg-[#e5e3de]" />
      </div>
      <div className="flex flex-col gap-2.5">
        {bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
      </div>
    </div>
  );
}

export default function TutorBookings() {
  const { id } = useParams();
  const { data: tutor } = useGetTutorByIdQuery(id as string);
  const { data, isLoading } = useGetTutorBookingsQuery(tutor?.user.id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-10 py-10 flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-9 w-56 rounded" />
        </div>
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => <BookingSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-10 py-10 max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-indigo-500 block" />
            <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
              Tutor dashboard
            </span>
          </div>
          <h1 className="font-display text-[28px] sm:text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight">
            My{" "}
            <em className="font-display italic font-light text-indigo-500">bookings</em>
          </h1>
        </div>
        <div className="bg-white border border-[#e5e3de] rounded-xl flex flex-col items-center justify-center py-20 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-[#f0ede8] flex items-center justify-center mb-4 text-xl">
            📅
          </div>
          <p className="text-sm font-medium text-[#1a1a18] mb-1">No bookings yet</p>
          <p className="text-xs text-[#9e9c97] font-light leading-relaxed mb-5">
            Students haven't booked any sessions with you yet.
          </p>
          <Link
            href={`/tutors/${id}/availability`}
            className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors"
          >
            Manage availability →
          </Link>
        </div>
      </div>
    );
  }

  const grouped = STATUS_ORDER.reduce<Record<string, Booking[]>>((acc, status) => {
    acc[status] = data.filter((b: Booking) => b.status === status);
    return acc;
  }, {});

  const confirmedCount = grouped["CONFIRMED"]?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-10 py-10 flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-5 h-px bg-indigo-500 block" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
            Tutor dashboard
          </span>
        </div>
        <h1 className="font-display text-[28px] sm:text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight">
          My{" "}
          <em className="font-display italic font-light text-indigo-500">bookings</em>
        </h1>
        <p className="text-sm text-[#9e9c97] font-light mt-1.5">
          {confirmedCount > 0
            ? `${confirmedCount} upcoming session${confirmedCount !== 1 ? "s" : ""}`
            : "No upcoming sessions"}
          {" "}· {data.length} total
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {STATUS_ORDER.map((status) => (
          <BookingGroup key={status} status={status} bookings={grouped[status] ?? []} />
        ))}
      </div>
    </div>
  );
}