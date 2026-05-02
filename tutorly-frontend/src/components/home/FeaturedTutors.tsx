"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tutor, useGetFeaturedTutorsQuery } from "@/features/tutors/tutorApi";
import Link from "next/link";

function getInitials(name?: string) {
  return (name || "Tutor")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColors(name?: string) {
  const palettes = [
    "bg-indigo-50 text-indigo-600",
    "bg-emerald-50 text-emerald-700",
    "bg-orange-50 text-orange-700",
    "bg-rose-50 text-rose-700",
    "bg-violet-50 text-violet-700",
    "bg-sky-50 text-sky-700",
  ];
  const source = name || "Tutor";
  return palettes[source.charCodeAt(0) % palettes.length];
}

function averageRating(reviews?: { rating: number }[]) {
  if (!reviews || reviews.length === 0) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function TutorCard({ tutor }: { tutor: Tutor }) {
  const name = tutor.user?.name || "Tutor";
  const subjects = tutor.subjects ?? [];
  const reviews = tutor.tutorReviews ?? tutor.user?.tutorReviews;
  const rating = tutor.averageRating ?? averageRating(reviews);
  const reviewCount = tutor.reviewCount ?? reviews?.length ?? 0;

  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="group flex flex-col bg-white border border-[#e5e3de] rounded-xl p-5
                 hover:border-indigo-400 hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${getAvatarColors(name)}`}>
          {getInitials(name)}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1a1a18] leading-tight">{name}</p>
          <p className="text-xs text-[#9e9c97] mt-0.5">${tutor.hourlyRate ?? 0} / hour</p>
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {subjects.slice(0, 3).map((subject) => (
            <span key={subject.id} className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-[3px]">
              {subject.name}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-[#6b6b66] leading-relaxed font-light flex-1">
        {tutor.bio || "Experienced tutor ready to help students learn with confidence."}
      </p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0ede8]">
        <span className="text-[11px] text-[#9e9c97]">
          {reviewCount > 0 && rating ? `★ ${rating.toFixed(1)} · ${reviewCount} reviews` : "No reviews yet"}
        </span>
        <span className="text-xs text-indigo-500 font-medium group-hover:text-indigo-700 transition-colors">
          Book →
        </span>
      </div>
    </Link>
  );
}

function TutorCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-[#e5e3de] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-3">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-24 rounded" />
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0ede8]">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

export function FeaturedTutors() {
  const { data, isLoading, isError } = useGetFeaturedTutorsQuery();
  const tutors = data?.data ?? [];

  return (
    <section className="px-5 sm:px-10 py-12 sm:py-16">
      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9e9c97] mb-2">
        Featured tutors
      </p>
      <h2 className="font-display text-[28px] sm:text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight mb-8 sm:mb-10">
        Meet a few of the{" "}
        <em className="font-display italic font-light text-indigo-500">best</em>
      </h2>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <TutorCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-xl border border-[#e5e3de] bg-white p-5 text-sm text-[#6b6b66]">
          Featured tutors are unavailable right now.
        </div>
      )}

      {!isLoading && !isError && tutors.length === 0 && (
        <div className="rounded-xl border border-[#e5e3de] bg-white p-5 text-sm text-[#6b6b66]">
          No featured tutors found yet.
        </div>
      )}

      {!isLoading && !isError && tutors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
        </div>
      )}

      <div className="mt-8">
        <Link href="/tutors" className="text-sm text-[#6b6b66] hover:text-[#1a1a18] transition-colors">
          View all tutors →
        </Link>
      </div>
    </section>
  );
}