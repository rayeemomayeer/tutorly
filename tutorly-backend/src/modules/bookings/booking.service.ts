import { prisma } from "../../lib/prisma";
import { TutorService } from "../tutors/tutor.service";

const createBooking = async (
  studentId: string,
  tutorId: string,
  scheduledAt: string,
  slotId: string
) => {
  const slot = await prisma.availability.findUnique({ where: { id: slotId } });

  if (!slot || slot.status === "BOOKED") {
    throw new Error("Selected slot is no longer available");
  }

  await prisma.availability.update({
    where: { id: slotId },
    data: { status: "BOOKED" },
  });

  // broadcast BOOKED event via SSE
  TutorService.broadcast(tutorId, {
    type: "BOOKED",
    slotId,
  });

  return prisma.booking.create({
    data: {
      studentId,
      tutorId,
      slotId, 
      scheduledAt: new Date(scheduledAt),
      status: "CONFIRMED",
    },
    include: { student: true, tutor: true, slot: true },
  });
};



const getBookings = async (userId: string, role: string) => {
  if (role === "student") {
    return prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        tutor: true,
      },
      orderBy: { scheduledAt: "asc" },
    });
  }
  if (role === "tutor") {
    return prisma.booking.findMany({
      where: { tutorId: userId },
      include: {
        student: true,
      },
      orderBy: { scheduledAt: "asc" },
    });
  }
  if (role === "admin") {
    return prisma.booking.findMany();
  }
  return [];
};

const cancelBooking = async (id: string) => {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: { tutor: true, slot: true },
  });

  if (booking.slotId) {
    await prisma.availability.update({
      where: { id: booking.slotId },
      data: { status: "OPEN" },
    });

    TutorService.broadcast(booking.tutorId, {
      type: "OPEN",
      slotId: booking.slotId,
    });
  }

  return booking;
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