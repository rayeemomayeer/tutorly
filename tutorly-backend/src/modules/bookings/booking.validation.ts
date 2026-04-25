import { z } from "zod";

export const createBookingSchema = z.object({
  scheduledAt: z.iso.datetime({
    message: "Must be a valid ISO datetime",
  }),
});
