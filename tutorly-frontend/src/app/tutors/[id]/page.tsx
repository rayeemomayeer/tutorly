"use client";

import { use } from "react";
import { useGetTutorByIdQuery } from "@/features/tutors/tutorApi";
import ReviewList from "@/features/reviews/ReviewList";
import ReviewForm from "@/features/reviews/ReviewForm";

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const tutorId = id;

  const { data: tutor, isLoading } = useGetTutorByIdQuery(tutorId);

  if (isLoading) return <p>Loading tutor...</p>;
  if (!tutor) return <p>Tutor not found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{tutor.user.name}</h1>
      <p>{tutor.bio}</p>
      <p>Subjects: {tutor.subjects?.join(", ")}</p>

      <ReviewForm tutorId={tutorId} />
      <ReviewList tutorId={tutorId} />
    </div>
  );
}