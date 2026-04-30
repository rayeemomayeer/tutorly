"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useGetTutorByIdQuery } from "@/features/tutors/tutorApi";
import { useGetAvailabilityQuery } from "@/features/availability/availabilityApi";
import { useCreateBookingMutation } from "@/features/bookings/bookingApi";

import ReviewList from "@/features/reviews/ReviewList";
import ReviewForm from "@/features/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import { useGetSessionQuery } from "@/features/auth/authApi";

type Slot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: string;
};

export default function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: tutor, isLoading } = useGetTutorByIdQuery(id);

  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  if (isSessionLoading) return <p>Loading session...</p>;
  if (!session) {
    router.push("/login");
    return <p>Redirecting to login...</p>;
  }

  const {
    data: availability,
    isFetching,
    error,
  } = useGetAvailabilityQuery(id, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [createBooking] = useCreateBookingMutation();

  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  // LOCAL STATE (for SSE updates)
  const [localAvailability, setLocalAvailability] = useState<Slot[]>([]);

  // -----------------------------
  // INIT from RTK Query
  // -----------------------------
  useEffect(() => {
    if (availability) {
      setLocalAvailability(availability);
    }
  }, [availability]);

  // -----------------------------
  // ERROR HANDLING (safe)
  // -----------------------------
  useEffect(() => {
    if (error) {
      toast.error("Failed to load tutor availability.");
    }
  }, [error]);

  // -----------------------------
  // SSE REAL-TIME STREAM
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tutors/${id}/availability/stream`,
      {
        withCredentials: true, // send cookies/session
      }
    );

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "BOOKED") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, status: "BOOKED" } : s
          )
        );
      }

      if (data.type === "OPEN") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, status: "OPEN" } : s
          )
        );
      }

      if (data.type === "DELETED") {
        setLocalAvailability(prev =>
          prev.filter(s => s.id !== data.slotId)
        );
      }

      if (data.type === "UPDATED") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, ...data.slot } : s
          )
        );
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection failed");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  if (isLoading) return <p>Loading tutor...</p>;
  if (!tutor) return <p>Tutor not found.</p>;

  // -----------------------------
  // BOOKING HANDLER
  // -----------------------------
  const handleBook = async (slot: Slot) => {
    const loadingToast = toast.loading("Booking session...");
    setBookingSlotId(slot.id);

    try {
      await createBooking({
        tutorId: tutor.user.id,
        scheduledAt: slot.startTime,
        slotId: slot.id,
      }).unwrap();

      toast.success("Booking confirmed!", { id: loadingToast });

      router.push("/student/bookings");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Booking failed.",
        { id: loadingToast }
      );
    } finally {
      setBookingSlotId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{tutor.user.name}</h1>
      <p>{tutor.bio}</p>
      <p>
        Subjects:{" "}
        {tutor.subjects?.map((s: any) => s.name).join(", ")}
      </p>

      <h2 className="text-xl font-bold">Availability</h2>

      {isFetching ? (
        <p>Loading availability...</p>
      ) : localAvailability?.filter((s) => s.status === "OPEN").length > 0 ? (
        localAvailability
          .filter((slot) => slot.status === "OPEN")
          .map((slot) => {
            const isBooking = bookingSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className="border p-4 flex justify-between items-center"
              >
                <p>
                  Day {slot.dayOfWeek}:{" "}
                  {new Date(slot.startTime).toLocaleTimeString()} -{" "}
                  {new Date(slot.endTime).toLocaleTimeString()}
                </p>

                <Button
                  onClick={() => handleBook(slot)}
                  disabled={isBooking}
                >
                  {isBooking ? "Booking..." : "Book"}
                </Button>
              </div>
            );
          })
      ) : (
        <p>No available slots.</p>
      )}

      <ReviewForm tutorId={tutor.user.id} />   
      <ReviewList tutorId={tutor.user.id} />

    </div>
  );
}