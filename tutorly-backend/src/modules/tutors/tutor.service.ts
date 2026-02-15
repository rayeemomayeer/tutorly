import { prisma } from "../../lib/prisma";

const getAllTutors = async () => {
  return prisma.tutorProfile.findMany({
    include: { subjects: true, user: true },
  });
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