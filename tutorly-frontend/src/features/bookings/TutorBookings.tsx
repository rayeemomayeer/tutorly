
"use client";
import { useParams } from "next/navigation";
import { useGetTutorBookingsQuery } from "@/features/bookings/bookingApi";
import CancelBookingButton from "./CancelBookingButton";
import CompleteBookingButton from "./CompleteBookingButton";
import { useGetTutorByIdQuery } from "../tutors/tutorApi";

export default function TutorBookings() {
  const { id } = useParams();
  const { data: tutor } = useGetTutorByIdQuery(id as string);
  const { data, isLoading } = useGetTutorBookingsQuery(tutor?.user.id as string);


  if (isLoading) return <p>Loading bookings...</p>;
  if (!data || data.length === 0) return <p>No bookings yet.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Bookings</h2>
      {data.map((booking: any) => (
        <div key={booking.id} className="border p-4 flex justify-between items-center">
          <div>
            <p>Status: {booking.status}</p>
            <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
            <p>Student: {booking.student?.name || "Unknown"}</p>
          </div>
          {booking.status === "CONFIRMED" && (
            <div className="flex gap-2">
              <CancelBookingButton id={booking.id} />
              <CompleteBookingButton id={booking.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
