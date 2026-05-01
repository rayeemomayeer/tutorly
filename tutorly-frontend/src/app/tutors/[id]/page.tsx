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

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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
      <div className="max-w-6xl mx-auto px-10 py-12 flex gap-12">

        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="w-[320px] shrink-0">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  isBooking,
  onBook,
}: {
  slot: Slot;
  isBooking: boolean;
  onBook: (slot: Slot) => void;
}) {
  return (
    <div
      className="flex items-center justify-between bg-[#fafaf8] border border-[#e5e3de]
                 rounded-lg px-3.5 py-3 hover:border-indigo-300 transition-colors duration-150"
    >
      <div>
        <p className="text-sm font-medium text-[#1a1a18] leading-tight">
          {formatTime(slot.startTime)}
        </p>
        <p className="text-xs text-[#9e9c97] font-light mt-0.5">
          until {formatTime(slot.endTime)}
        </p>
      </div>
      <button
        onClick={() => onBook(slot)}
        disabled={isBooking}
        className={`text-xs font-medium px-4 py-2 rounded-md transition-all duration-150
          ${isBooking
            ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
            : "bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95"
          }`}
      >
        {isBooking ? (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-indigo-300 border-t-indigo-500 animate-spin" />
            Booking
          </span>
        ) : (
          "Book →"
        )}
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
  const slotsByDay = groupSlotsByDay(openSlots);
  const sortedDays = Array.from(slotsByDay.keys()).sort((a, b) => a - b);

  return (
    <div className="w-[320px] shrink-0">
      {/* Sticky wrapper */}
      <div className="sticky top-[73px] flex flex-col gap-3">

        {/* Panel header */}
        <div className="bg-white border border-[#e5e3de] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0ede8]">
            <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
              Available slots
            </p>
            <p className="font-display text-lg font-normal text-[#1a1a18] tracking-tight mt-0.5">
              {isFetching ? (
                <Skeleton className="h-5 w-24 mt-1" />
              ) : openSlots.length > 0 ? (
                <>
                  <em className="font-display italic font-light text-indigo-500">
                    {openSlots.length}
                  </em>{" "}
                  open this week
                </>
              ) : (
                "No slots open"
              )}
            </p>
          </div>

          <div className="px-4 py-4 flex flex-col gap-4 max-h-[460px] overflow-y-auto">
            {isFetching ? (
              // Loading skeletons
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : openSlots.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#f0ede8] flex items-center justify-center mb-3 text-lg">
                  📅
                </div>
                <p className="text-sm text-[#1a1a18] font-medium mb-1">
                  No open slots
                </p>
                <p className="text-xs text-[#9e9c97] font-light leading-relaxed">
                  This tutor hasn't added any available slots yet.
                </p>
              </div>
            ) : (
              sortedDays.map((day) => (
                <div key={day} className="flex flex-col gap-2">
                  {/* Day label */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#9e9c97]">
                      {DAYS[day]}
                    </span>
                    <div className="flex-1 h-px bg-[#f0ede8]" />
                  </div>
                  {slotsByDay.get(day)!.map((slot) => (
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

        {slots.filter((s) => s.status === "BOOKED").length > 0 && (
          <p className="text-[11px] text-[#c4c2bd] font-light text-center">
            {slots.filter((s) => s.status === "BOOKED").length} slot
            {slots.filter((s) => s.status === "BOOKED").length !== 1 ? "s" : ""}{" "}
            already booked this week
          </p>
        )}

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

  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  if (isSessionLoading) return <ProfileSkeleton />;
  if (!session) {
    router.push("/login");
    return null;
  }

  const { data: tutor, isLoading } = useGetTutorByIdQuery(id);
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
  const [localAvailability, setLocalAvailability] = useState<Slot[]>([]);

  useEffect(() => {
    if (availability) setLocalAvailability(availability);
  }, [availability]);

  useEffect(() => {
    if (error) toast.error("Failed to load tutor availability.");
  }, [error]);

  useEffect(() => {
    if (!id) return;

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tutors/${id}/availability/stream`,
      { withCredentials: true }
    );

    eventSource.onopen = () => console.log("SSE connection established");

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
        setLocalAvailability((prev) =>
          prev.filter((s) => s.id !== data.slotId)
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

    return () => eventSource.close();
  }, [id]);

  const handleBook = async (slot: Slot) => {
    if (!tutor) return;

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
      toast.error(err?.data?.message || "Booking failed.", {
        id: loadingToast,
      });
    } finally {
      setBookingSlotId(null);
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-[#1a1a18] mb-2">
            Tutor not found
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const reviews = tutor.tutorReviews ?? [];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#fafaf8]">

      <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-4
                      bg-[#fafaf8] border-b border-[#e5e3de]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#9e9c97] hover:text-[#1a1a18] transition-colors"
        >
          ← Tutors
        </button>
        <span className="font-display text-base font-normal text-[#1a1a18] tracking-tight">
          Tutorly
        </span>
        <div className="w-20" /> 
      </nav>

      <div className="max-w-6xl mx-auto px-10 py-10 flex gap-12 items-start">

        <div className="flex-1 min-w-0 flex flex-col gap-10">

          <div className="flex items-start gap-5">
            {/* Avatar */}
            {tutor.user.image ? (
              <img
                src={tutor.user.image}
                alt={tutor.user.name}
                className="w-[72px] h-[72px] rounded-full object-cover shrink-0 border border-[#e5e3de]"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-indigo-50 flex items-center justify-center
                              text-indigo-600 text-xl font-medium shrink-0 border border-[#e5e3de]">
                {getInitials(tutor.user.name)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight">
                {tutor.user.name}
              </h1>

              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <span className="text-sm text-[#6b6b66] font-light">
                  <span className="font-medium text-[#1a1a18]">
                    ${tutor.hourlyRate}
                  </span>{" "}
                  / hour
                </span>

                {avgRating && (
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-sm text-[#6b6b66]">
                      {avgRating}
                      <span className="text-[#c4c2bd] ml-1 text-xs">
                        ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#e5e3de]" />

          {tutor.bio && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
                About
              </p>
              <p className="text-[15px] text-[#3a3a38] font-light leading-[1.75]">
                {tutor.bio}
              </p>
            </div>
          )}

          {tutor.subjects?.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
                Subjects
              </p>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((s: any) => (
                  <span
                    key={s.id}
                    className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-100
                               px-3 py-1 rounded-full font-light"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-[#e5e3de]" />

          <div className="flex flex-col gap-6">
            <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
              Reviews
            </p>
            <ReviewForm tutorId={tutor.user.id} />
            <ReviewList tutorId={tutor.user.id} />
          </div>

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