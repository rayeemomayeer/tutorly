import { Router } from "express";
import { ReviewController } from "./review.controller";
import authMiddleware from "src/middleware/authMiddleware";
import { createReviewSchema } from "./review.validation";
import { validate } from "src/middleware/validate";


const reviewRouter = Router();


reviewRouter.post(
  "/",
  authMiddleware("review", "create"),
  validate(createReviewSchema),
  ReviewController.createReview
);


reviewRouter.get("/:tutorId", authMiddleware("review", "read"), ReviewController.getReviewsByTutor);


reviewRouter.delete("/:id", authMiddleware("review", "delete"), ReviewController.deleteReview);

export default reviewRouter;