import { Request, Response } from "express";
import { ReviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  const { tutorId, rating, comment } = req.body;
  const studentId = (req as any).session.user.id;
  const review = await ReviewService.createReview(studentId, tutorId, rating, comment);
  res.status(201).json(review);
};

const getReviewsByTutor = async (req: Request, res: Response) => {
  const { tutorId } = req.params;
  const reviews = await ReviewService.getReviewsByTutor(tutorId as string);
  res.json(reviews);
};

const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  await ReviewService.deleteReview(id as string);
  res.status(204).send();
};

export const ReviewController = {
  createReview,
  getReviewsByTutor,
  deleteReview,
};