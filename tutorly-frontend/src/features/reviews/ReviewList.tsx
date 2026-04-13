"use client";
import { Button } from "@/components/ui/button";
import { useDeleteReviewMutation, useGetTutorReviewsQuery } from "./reviewApi";

export default function ReviewList({ tutorId }: { tutorId: string }) {
  const { data, isLoading } = useGetTutorReviewsQuery(tutorId);
  const [deleteReview] = useDeleteReviewMutation();

  if (isLoading) return <p>Loading reviews...</p>;
  if (!data || data.length === 0) return <p>No reviews yet.</p>;

   return (
    <div className="space-y-4">
      {data.map((review) => (
        <div key={review.id} className="border p-4 flex justify-between">
          <div>
            <p className="font-bold">{review.student?.name}</p>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
          <Button variant="destructive" onClick={() => deleteReview(review.id)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
