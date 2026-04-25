"use client";
import {
  useGetBookingsQuery,
  useCancelBookingMutation,
} from "@/features/bookings/bookingApi";
import CancelBookingButton from "./CancelBookingButton";

export default function StudentBookings() {
  const { data, isLoading } = useGetBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();

  console.log("Bookings data:", data);

  if (isLoading) return <p>Loading your bookings...</p>;
  if (!data || data.length === 0) return <p>You have no upcoming bookings.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Upcoming Sessions</h2>
      {data.map((booking: any) => (
        <div key={booking.id} className="border p-4 flex justify-between items-center">
          <div>
            <p>Status: {booking.status}</p>
            <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
            <p>Tutor: {booking.tutor?.name}</p>
          </div>
          {booking.status === "CONFIRMED" && (
            <CancelBookingButton id={booking.id} />
          )}
        </div>
      ))}
    </div>
  );
}
