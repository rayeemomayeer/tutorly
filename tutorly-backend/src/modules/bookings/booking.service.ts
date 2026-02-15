import { prisma } from "../../lib/prisma";

const createBooking = async (
  studentId: string,
  tutorId: string,
  scheduledAt: string, 
  duration: number 
) => {
  return prisma.booking.create({
    data: {
      studentId,
      tutorId,
      scheduledAt: new Date(scheduledAt),
      status: "CONFIRMED", 
    },
    include: { student: true, tutor: true },
  });
};


const getBookings = async (userId: string, role: string) => {
  if (role === "student") {
    return prisma.booking.findMany({ where: { studentId: userId } });
  }
  if (role === "tutor") {
    return prisma.booking.findMany({ where: { tutorId: userId } });
  }
  if (role === "admin") {
    return prisma.booking.findMany();
  }
  return [];
};

const cancelBooking = async (id: string) => {
  return prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

const completeBooking = async (id: string) => {
  return prisma.booking.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
};

const listAllBookings = async () => {
  return prisma.booking.findMany({
    include: { student: true, tutor: true },
  });
};

export const BookingService = {
  createBooking,
  getBookings,
  cancelBooking,
  completeBooking,
  listAllBookings,
};