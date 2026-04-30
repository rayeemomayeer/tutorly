"use client";
import { useState } from "react";
import { useCreateReviewMutation } from "./reviewApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewForm({ tutorId }: { tutorId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({ tutorId, rating: Number(rating), comment }); // ✅ no studentId
    setRating(5);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <Textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
