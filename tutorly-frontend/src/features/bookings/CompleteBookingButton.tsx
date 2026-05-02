"use client";

import { useCompleteBookingMutation } from "@/features/bookings/bookingApi";

export default function CompleteBookingButton({ id }: { id: string }) {
  const [completeBooking, { isLoading }] = useCompleteBookingMutation();

  return (
    <button
      onClick={() => completeBooking(id)}
      disabled={isLoading}
      className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md
                  transition-all duration-150
                  ${isLoading
                    ? "bg-emerald-50 text-emerald-300 cursor-not-allowed"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95"
                  }`}
    >
      {isLoading ? (
        <>
          <span className="w-3 h-3 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
          Completing
        </>
      ) : (
        "Mark complete"
      )}
    </button>
  );
}