"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useGetTutorByIdQuery } from "@/features/tutors/tutorApi";
import { useGetAvailabilityQuery } from "@/features/availability/availabilityApi";
import { useCreateBookingMutation } from "@/features/bookings/bookingApi";
import { useGetSessionQuery } from "@/features/auth/authApi";
import ReviewList from "@/features/reviews/ReviewList";
import ReviewForm from "@/features/reviews/ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";

type Slot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: string;
};

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function groupSlotsByDay(slots: Slot[]): Map<number, Slot[]> {
  const map = new Map<number, Slot[]>();
  for (const slot of slots) {
    if (!map.has(slot.dayOfWeek)) map.set(slot.dayOfWeek, []);
    map.get(slot.dayOfWeek)!.push(slot);
  }
  return map;
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 sm:h-8 w-40 sm:w-52" />
              <Skeleton className="h-4 w-28 sm:w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <div className="w-full lg:w-[320px]">
          <Skeleton className="h-[320px] sm:h-[400px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function SlotCard({ slot, isBooking, onBook }: {
  slot: Slot;
  isBooking: boolean;
  onBook: (slot: Slot) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-[#fafaf8] border border-[#e5e3de] rounded-lg px-3 py-3">
      <div>
        <p className="text-sm font-medium text-[#1a1a18]">
          {formatTime(slot.startTime)}
        </p>
        <p className="text-xs text-[#9e9c97]">
          until {formatTime(slot.endTime)}
        </p>
      </div>
      <button
        onClick={() => onBook(slot)}
        disabled={isBooking}
        className={`text-xs px-3 py-2 rounded-md ${
          isBooking
            ? "bg-indigo-100 text-indigo-400"
            : "bg-indigo-500 text-white"
        }`}
      >
        {isBooking ? "Booking..." : "Book"}
      </button>
    </div>
  );
}

function AvailabilityPanel({
  isFetching,
  slots,
  bookingSlotId,
  onBook,
}: {
  isFetching: boolean;
  slots: Slot[];
  bookingSlotId: string | null;
  onBook: (slot: Slot) => void;
}) {
  const openSlots = slots.filter((s) => s.status === "OPEN");
  const grouped = groupSlotsByDay(openSlots);
  const days = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <div className="w-full lg:w-[320px]">
      <div className="lg:sticky lg:top-[80px] flex flex-col gap-3">
        <div className="bg-white border border-[#e5e3de] rounded-xl overflow-hidden">
          <div className="px-4 py-4 border-b border-[#f0ede8]">
            <p className="text-xs text-[#9e9c97] uppercase">Available slots</p>
            <p className="text-lg text-[#1a1a18] mt-1">
              {openSlots.length} open
            </p>
          </div>

          <div className="px-3 py-3 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
            {isFetching ? (
              <Skeleton className="h-14 w-full" />
            ) : openSlots.length === 0 ? (
              <p className="text-sm text-center text-[#9e9c97]">
                No slots available
              </p>
            ) : (
              days.map((day) => (
                <div key={day} className="flex flex-col gap-2">
                  <p className="text-xs text-[#9e9c97] uppercase">
                    {DAYS[day]}
                  </p>
                  {grouped.get(day)!.map((slot) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      isBooking={bookingSlotId === slot.id}
                      onBook={onBook}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: session, isLoading: sessionLoading } = useGetSessionQuery();
  if (sessionLoading) return <ProfileSkeleton />;
  if (!session) {
    router.push("/login");
    return null;
  }

  const { data: tutor, isLoading } = useGetTutorByIdQuery(id);
  const { data: availability, isFetching } = useGetAvailabilityQuery(id);

  const [createBooking] = useCreateBookingMutation();
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [localAvailability, setLocalAvailability] = useState<Slot[]>([]);

  useEffect(() => {
    if (availability) setLocalAvailability(availability);
  }, [availability]);

  useEffect(() => {
    if (!id) return;
    const es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tutors/${id}/availability/stream`,
      { withCredentials: true }
    );

    es.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "BOOKED") {
        setLocalAvailability((p) =>
          p.map((s) => (s.id === d.slotId ? { ...s, status: "BOOKED" } : s))
        );
      }
    };

    return () => es.close();
  }, [id]);

  const handleBook = async (slot: Slot) => {
    if (!tutor) return;

    const t = toast.loading("Booking...");
    setBookingSlotId(slot.id);

    try {
      await createBooking({
        tutorId: tutor.user.id,
        scheduledAt: slot.startTime,
        slotId: slot.id,
      }).unwrap();

      toast.success("Booked", { id: t });
      router.push("/student/bookings");
    } catch {
      toast.error("Failed", { id: t });
    } finally {
      setBookingSlotId(null);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  const subjects = tutor?.subjects ?? [];

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <nav className="sticky top-0 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 border-b bg-[#fafaf8]">
        <button onClick={() => router.back()} className="text-sm">
          ← Back
        </button>
        <div className="w-10" />
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">

        <div className="flex-1 flex flex-col gap-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {tutor?.user.image ? (
              <img
                src={tutor.user.image}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                {tutor && getInitials(tutor.user.name)}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl">
                {tutor?.user.name}
              </h1>
              <p className="text-sm">${tutor?.hourlyRate}/hr</p>
            </div>
          </div>

          {tutor?.bio && <p className="text-sm">{tutor.bio}</p>}

          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subjects.map((s: any) => (
                <span key={s.id} className="text-xs bg-indigo-50 px-2 py-1 rounded">
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {tutor && (
            <div className="flex flex-col gap-4">
              <ReviewForm tutorId={tutor.user.id} />
              <ReviewList tutorId={tutor.user.id} />
            </div>
          )}

        </div>

        <AvailabilityPanel
          isFetching={isFetching}
          slots={localAvailability}
          bookingSlotId={bookingSlotId}
          onBook={handleBook}
        />

      </div>
    </div>
  );
}