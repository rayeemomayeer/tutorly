"use client";

import { useCancelBookingMutation } from "@/features/bookings/bookingApi";

export default function CancelBookingButton({ id }: { id: string }) {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  return (
    <button
      onClick={() => cancelBooking(id)}
      disabled={isLoading}
      className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md
                  transition-all duration-150
                  ${isLoading
                    ? "bg-rose-50 text-rose-300 cursor-not-allowed"
                    : "bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95"
                  }`}
    >
      {isLoading ? (
        <>
          <span className="w-3 h-3 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin" />
          Cancelling
        </>
      ) : (
        "Cancel session"
      )}
    </button>
  );
}