import { z } from "zod";

export const createReviewSchema = z.object({
  tutorId: z.string().min(1, "Tutor ID is required"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"), 
  comment: z.string().trim().min(1, "Comment is required"),
});
