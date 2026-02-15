import { z } from "zod";

export const promoteUserSchema = z.object({
  role: z.enum(["tutor", "admin"]),
});