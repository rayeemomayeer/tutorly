"use client";
import { Button } from "@/components/ui/button";
import { useDeleteReviewMutation, useGetTutorReviewsQuery } from "./reviewApi";
import { useGetSessionQuery } from "../auth/authApi";

export default function ReviewList({ tutorId }: { tutorId: string;  }) {
  const { data, isLoading } = useGetTutorReviewsQuery(tutorId);
  const [deleteReview] = useDeleteReviewMutation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();

  if (isLoading || isSessionLoading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No reviews yet.</p>;

  console.log("Reviews data:", data);
  console.log(session)
  return (
    <div className="space-y-4">
      {data.map((review) => (
        <div key={review.id} className="border p-4 flex justify-between">
          <div>
            <p className="font-bold">{review.student?.name}</p>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
          {(session?.user.id === review.studentId || session?.user.role === "admin" || session?.user.id === review.tutorId) && (
            <Button
              variant="destructive"
              onClick={() => deleteReview(review.id)}
            >
              Delete
            </Button>
          )}

        </div>
      ))}
    </div>
  );
}
