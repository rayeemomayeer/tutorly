import { prisma } from "../../lib/prisma";

const createReview = async (
  studentId: string,
  tutorId: string,
  rating: number,
  comment: string
) => {
  return prisma.review.create({
    data: {
      studentId,
      tutorId,
      rating,
      comment,
    },
    include: { student: true, tutor: true },
  });
};

const getReviewsByTutor = async (tutorId: string) => {
  return prisma.review.findMany({
    where: { tutorId },
    include: { student: true },
  });
};

const deleteReview = async (id: string) => {
  return prisma.review.delete({ where: { id } });
};

export const ReviewService = {
  createReview,
  getReviewsByTutor,
  deleteReview,
};