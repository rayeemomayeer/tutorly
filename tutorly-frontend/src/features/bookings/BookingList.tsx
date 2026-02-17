
"use client";
import { useGetBookingsQuery } from "./bookingApi";
import CancelBookingButton from "./CancelBookingButton";

export default function BookingList() {
  const { data, isLoading } = useGetBookingsQuery();

  if (isLoading) return <p>Loading bookings...</p>;

  if (!data || data.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Bookings</h2>
      {data.map((booking: any) => (
        <div key={booking.id} className="border p-4 flex justify-between">
          <div>
            <p>Status: {booking.status}</p>
            <p>Scheduled: {booking.scheduledAt}</p>
          </div>
          {booking.status === "pending" && (
            <CancelBookingButton id={booking.id} />
          )}
        </div>
      ))}
    </div>
  );
}