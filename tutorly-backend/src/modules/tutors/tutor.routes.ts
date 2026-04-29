import { Router } from "express";


import authMiddleware from "src/middleware/authMiddleware";
import { TutorController } from "./tutor.controller";
import { validate } from "src/middleware/validate";
import { createTutorProfileSchema, updateTutorProfileSchema } from "./tutor.validation";

const tutorRouter = Router();


tutorRouter.get("/", authMiddleware("tutor", "read"), TutorController.getAllTutors);

tutorRouter.get("/:id", authMiddleware("tutor", "read"), TutorController.getTutorById);


tutorRouter.get(
  "/:id/bookings",
  authMiddleware("booking", "read"),
  TutorController.getTutorBookings
);



tutorRouter.get(
  "/:id/availability/stream",
  authMiddleware("availability", "read"),
  TutorController.streamAvailability
);

tutorRouter.get(
  "/:id/availability",
  authMiddleware("availability", "read"),
  TutorController.getAvailability
);

tutorRouter.post(
  "/:id/availability",
  authMiddleware("availability", "create"),
  TutorController.setAvailability
);

tutorRouter.put(
  "/:tutorId/availability/:slotId",
  authMiddleware("availability", "update"),
  TutorController.updateAvailabilitySlot
);

tutorRouter.delete(
  "/:tutorId/availability/:slotId",
  authMiddleware("availability", "delete"),
  TutorController.deleteAvailabilitySlot
);








tutorRouter.post(
  "/profile",
  authMiddleware("tutor", "create"),
  validate(createTutorProfileSchema),
  TutorController.createTutorProfile
);

tutorRouter.put(
  "/profile/:id",
  authMiddleware("tutor", "update"),
  validate(updateTutorProfileSchema),
  TutorController.updateTutorProfile
);


tutorRouter.delete(
  "/profile/:id",
  authMiddleware("tutor", "delete"),
  TutorController.deleteTutorProfile
);

export default tutorRouter;