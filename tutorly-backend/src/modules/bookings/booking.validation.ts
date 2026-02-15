import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.uuid({
    message: "Tutor ID must be a valid UUID",
  }),

  scheduledAt: z.iso.datetime({
    message: "Must be a valid ISO datetime",
  }),
});
