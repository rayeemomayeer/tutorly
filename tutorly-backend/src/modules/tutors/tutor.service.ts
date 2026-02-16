import { prisma } from "../../lib/prisma";
import { TutorFilters } from "./tutor.types";

const getAllTutors = async (page: number,
  limit: number,
  filters: TutorFilters
) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters.categoryId) {
    where.subjects = { some: { id: filters.categoryId } };
  }
  if (filters.minRate) {
    where.hourlyRate = { gte: filters.minRate };
  }
  if (filters.maxRate) {
    where.hourlyRate = { ...where.hourlyRate, lte: filters.maxRate };
  }
  if (filters.search) {
    where.OR = [
      { bio: { contains: filters.search, mode: "insensitive" } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where,
      skip,
      take: limit,
      include: { subjects: true, user: true },
    }),
    prisma.tutorProfile.count({ where }),
  ]);

  return {
    data: tutors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const getTutorById = async (id: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: { subjects: true, user: true },
  });
};

const createTutorProfile = async (
  userId: string,
  bio: string,
  hourlyRate: number,
  subjects: string[]
) => {
  return prisma.tutorProfile.create({
    data: {
      userId,
      bio,
      hourlyRate,
      subjects: {
        connect: subjects.map((name) => ({ name })),
      },
    },
    include: { subjects: true, user: true },
  });
};

const updateTutorProfile = async (
  id: string,
  bio: string,
  hourlyRate: number,
  subjects: string[]
) => {
  return prisma.tutorProfile.update({
    where: { id },
    data: {
      bio,
      hourlyRate,
      subjects: {
        set: [],
        connect: subjects.map((name) => ({ name })),
      },
    },
    include: { subjects: true, user: true },
  });
};

const deleteTutorProfile = async (id: string) => {
  return prisma.tutorProfile.delete({ where: { id } });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile,
};