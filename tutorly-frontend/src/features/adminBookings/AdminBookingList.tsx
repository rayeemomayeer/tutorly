"use client";

import { AdminBooking, useGetAllBookingsQuery } from "./adminBookingApi";
import AdminBookingActions from "./AdminBookingActions";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBookingList() {
  const { data, isLoading } = useGetAllBookingsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e5e3de] rounded-xl flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-[#f0ede8] flex items-center justify-center mb-3 text-lg">
          📅
        </div>
        <p className="text-sm font-medium text-[#1a1a18] mb-1">
          No bookings found
        </p>
        <p className="text-xs text-[#9e9c97] font-light">
          There are no session bookings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((booking: AdminBooking) => (
        <div
          key={booking.id}
          className="group bg-white border border-[#e5e3de] border-l-4 border-l-indigo-400
                     rounded-xl px-4 sm:px-5 py-4
                     flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5
                     hover:shadow-sm transition-all duration-150"
        >

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <p className="text-sm font-medium text-[#1a1a18] truncate">
              {booking.student?.name ?? "Unknown student"} →{" "}
              {booking.tutor?.name ?? "Unknown tutor"}
            </p>

            <p className="text-xs text-[#6b6b66] font-light">
              {formatDate(booking.scheduledAt)} · {formatTime(booking.scheduledAt)}
            </p>

            <span
              className={`inline-flex w-fit items-center text-[11px] font-medium px-2.5 py-1 rounded-full mt-1
              ${
                booking.status === "COMPLETED"
                  ? "text-emerald-700 bg-emerald-50"
                  : booking.status === "CANCELLED"
                  ? "text-stone-500 bg-stone-100"
                  : "text-indigo-600 bg-indigo-50"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
            <AdminBookingActions id={booking.id} status={booking.status} />
          </div>

        </div>
      ))}
    </div>
  );
}