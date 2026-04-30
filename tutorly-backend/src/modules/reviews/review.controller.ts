import { Request, Response } from "express";
import { ReviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const { tutorId, rating, comment } = req.body;
    const studentId = req.user?.id || (req as any).session?.user?.id;

    if (!studentId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const review = await ReviewService.createReview(studentId, tutorId, Number(rating), comment);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


const getReviewsByTutor = async (req: Request, res: Response) => {
  const { tutorId } = req.params;
  const reviews = await ReviewService.getReviewsByTutor(tutorId as string);
  res.json(reviews);
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || (req as any).session?.user?.id;       
    const userRole = req.user?.role || (req as any).session?.user?.role;
    const result = await ReviewService.deleteReview(id as string, userId as string, userRole as string);
    res.status(200).json(result);
  } catch (err: any) {
    if (err.message === "Review not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "Not authorized to delete this review") {
      return res.status(403).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const ReviewController = {
  createReview,
  getReviewsByTutor,
  deleteReview,
};
