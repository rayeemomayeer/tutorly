import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.string().uuid("Tutor ID must be a valid UUID"),
  scheduledAt: z.string().datetime("Must be a valid ISO datetime"),
});