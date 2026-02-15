import { z } from "zod";

export const createReviewSchema = z.object({
  tutorId: z.uuid({
    message: "Tutor ID must be a valid UUID",
  }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});