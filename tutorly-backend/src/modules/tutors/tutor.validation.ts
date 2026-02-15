import { z } from "zod";

export const createTutorProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  hourlyRate: z.number().min(1, "Hourly rate must be positive"),
  subjects: z.array(z.string().min(2)).nonempty("At least one subject required"),
});

export const updateTutorProfileSchema = z.object({
  bio: z.string().min(10).optional(),
  hourlyRate: z.number().min(1).optional(),
  subjects: z.array(z.string().min(2)).optional(),
});