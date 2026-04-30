import { prisma } from "../../lib/prisma";

const createReview = async (
  studentId: string,
  tutorId: string,
  rating: number,
  comment: string
) => {


  const existing = await prisma.review.findFirst({
    where: { studentId, tutorId },
  });

  if (existing) {
    throw new Error("You have already reviewed this tutor.");
  }

  const booking = await prisma.booking.findFirst({
    where: {
      studentId,
      tutorId,
      status: "COMPLETED",
    },
  });

  if (!booking) {
    throw new Error("You can only review tutors after completing a booking.");
  }

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
    include: { student: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const deleteReview = async (id: string, userId: string, userRole: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { tutor: true, student: true },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  const isAuthor = review.studentId === userId;
  const isTutor = review.tutorId === userId;
  const isAdmin = userRole === "admin";

  if (!isAuthor && !isTutor && !isAdmin) {
    throw new Error("Not authorized to delete this review");
  }

  await prisma.review.delete({
    where: { id },
  });

  return { message: "Review deleted successfully" };
};

export const ReviewService = {
  createReview,
  getReviewsByTutor,
  deleteReview,
};