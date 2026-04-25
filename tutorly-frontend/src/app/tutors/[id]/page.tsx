"use client";

import { useGetTutorByIdQuery } from "@/features/tutors/tutorApi";
import { useGetAvailabilityQuery } from "@/features/availability/availabilityApi";
import { useCreateBookingMutation } from "@/features/bookings/bookingApi";
import ReviewList from "@/features/reviews/ReviewList";
import ReviewForm from "@/features/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import { use } from "react";

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: tutor, isLoading } = useGetTutorByIdQuery(id);
  const { data: availability } = useGetAvailabilityQuery(id);
  const [createBooking] = useCreateBookingMutation();

  if (isLoading) return <p>Loading tutor...</p>;
  if (!tutor) return <p>Tutor not found.</p>;

  const handleBook = async (slot: any) => {
    try {
      await createBooking({
        tutorId: tutor.user.id,
        scheduledAt: slot.startTime,
      }).unwrap();

      alert("Booking confirmed!");
      window.location.href = "/student/bookings";
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Error booking session.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{tutor.user.name}</h1>
      <p>{tutor.bio}</p>
      <p>Subjects: {tutor.subjects?.map((s: any) => s.name).join(", ")}</p>

      <h2 className="text-xl font-bold">Availability</h2>
      {availability?.length > 0 ? (
        availability.map((slot: any) => (
          <div key={slot.id} className="border p-4 flex justify-between">
            <p>
              Day {slot.dayOfWeek}: {new Date(slot.startTime).toLocaleTimeString()} -{" "}
              {new Date(slot.endTime).toLocaleTimeString()}
            </p>
            <Button onClick={() => handleBook(slot)}>Book</Button>
          </div>
        ))
      ) : (
        <p>No availability set.</p>
      )}

      <ReviewForm tutorId={id} />
      <ReviewList tutorId={id} />
    </div>
  );
}
