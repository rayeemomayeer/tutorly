import { Router } from "express";


import authMiddleware from "src/middleware/authMiddleware";
import { TutorController } from "./tutor.controller";
import { validate } from "src/middleware/validate";
import { createTutorProfileSchema, updateTutorProfileSchema } from "./tutor.validation";

const tutorRouter = Router();


tutorRouter.get("/", authMiddleware("tutor", "read"), TutorController.getAllTutors);
tutorRouter.get("/:id", authMiddleware("tutor", "read"), TutorController.getTutorById);


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