
"use client";
import { useGetTutorBookingsQuery } from "./tutorBookingApi";
import CompleteBookingButton from "./CompleteBookingButton";
import { Button } from "@/components/ui/button";

export default function TutorBookingList() {
  const { data, isLoading } = useGetTutorBookingsQuery();

  if (isLoading) return <p>Loading bookings...</p>;
  if (!data || data.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Tutor Bookings</h2>
      {data.map((booking: any) => (
        <div key={booking.id} className="border p-4 flex justify-between">
          <div>
            <p>Status: {booking.status}</p>
            <p>Student: {booking.student?.name}</p>
            <p>Scheduled: {booking.scheduledAt}</p>
          </div>
          <div className="flex gap-2">
            {booking.status === "pending" && (
              <Button variant="destructive">Cancel</Button>
            )}
            {booking.status === "pending" && (
              <CompleteBookingButton id={booking.id} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}