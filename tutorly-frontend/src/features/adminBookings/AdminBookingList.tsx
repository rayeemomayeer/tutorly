
"use client";
import { useGetAllBookingsQuery } from "./adminBookingApi";
import AdminBookingActions from "./AdminBookingActions";

export default function AdminBookingList() {
  const { data, isLoading } = useGetAllBookingsQuery();

  if (isLoading) return <p>Loading bookings...</p>;
  if (!data || data.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="space-y-4">
      {data.map((booking: any) => (
        <div key={booking.id} className="border p-4 flex justify-between">
          <div>
            <p>Status: {booking.status}</p>
            <p>Student: {booking.student?.name}</p>
            <p>Tutor: {booking.tutor?.name}</p>
            <p>Scheduled: {booking.scheduledAt}</p>
          </div>
          <AdminBookingActions id={booking.id} status={booking.status} />
        </div>
      ))}
    </div>
  );
}