import { ServerResponse } from "http";
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
  categories: { id: string }[]
) => {
  const categoryIds = categories.map((c) => c.id);

  return prisma.tutorProfile.update({
    where: { id },
    data: {
      bio,
      hourlyRate,
      subjects: {
        set: [], 
        connect: categoryIds.map((id) => ({ id })), 
      },
    },
    include: { subjects: true, user: true },
  });
};

const deleteTutorProfile = async (id: string) => {
  return prisma.tutorProfile.delete({ where: { id } });
};

const getAvailability = async (tutorId: string) => {
  return prisma.availability.findMany({
    where: { tutorId, status: "OPEN", deleted: false },
    orderBy: { startTime: "asc" },
  });
};


const setAvailability = async (tutorId: string, slots: any[]) => {
  for (const s of slots) {
    const overlaps = await prisma.availability.findFirst({
      where: {
        tutorId,
        dayOfWeek: s.dayOfWeek,
        OR: [
          {
            startTime: { lt: new Date(s.endTime) },
            endTime: { gt: new Date(s.startTime) },
          },
        ],
      },
    });

    if (overlaps) {
      throw new Error("Slot overlaps with existing availability");
    }
  }

  return prisma.availability.createMany({
    data: slots.map((s) => ({
      tutorId,
      dayOfWeek: s.dayOfWeek,
      startTime: new Date(s.startTime),
      endTime: new Date(s.endTime),
      status: "OPEN",
    })),
  });
};

const updateAvailabilitySlot = async (
  tutorId: string,
  slotId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string
) => {

  const overlaps = await prisma.availability.findFirst({
    where: {
      tutorId,
      dayOfWeek,
      NOT: { id: slotId },
      OR: [
        {
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) },
        },
      ],
    },
  });
  if (overlaps) throw new Error("Slot overlaps with existing availability");

  return prisma.availability.update({
    where: { id: slotId },
    data: {
      dayOfWeek,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
};

const deleteAvailabilitySlot = async (tutorId: string, slotId: string) => {
  return prisma.availability.update({
    where: { id: slotId },
    data: { deleted: true },
  });
};



const getTutorBookings = async (tutorId: string) => {
  return prisma.booking.findMany({
    where: { tutorId },
    include: { student: true },
    orderBy: { scheduledAt: "asc" },
  });
};


const clients: Record<string, ServerResponse[]> = {};

const addClient = (tutorId: string, res: ServerResponse) => {
  if (!clients[tutorId]) {
    clients[tutorId] = [];
  }

  clients[tutorId].push(res);
};

const removeClient = (tutorId: string, res: ServerResponse) => {
  if (!clients[tutorId]) return;

  clients[tutorId] = clients[tutorId].filter((c) => c !== res);

  if (clients[tutorId].length === 0) {
    delete clients[tutorId];
  }
};

const broadcast = (tutorId: string, event: any) => {
  const data = `data: ${JSON.stringify(event)}\n\n`;

  clients[tutorId]?.forEach((res) => {
    res.write(data);
  });
};


const markSlotBooked = async (slotId: string) => {
  const slot = await prisma.availability.update({
    where: { id: slotId },
    data: { status: "BOOKED" },
  });

  broadcast(slot.tutorId, {
    type: "BOOKED",
    slotId: slot.id,
  });

  return slot;
};

const markSlotOpen = async (slotId: string) => {
  const slot = await prisma.availability.update({
    where: { id: slotId },
    data: { status: "OPEN" },
  });

  broadcast(slot.tutorId, {
    type: "OPEN",
    slotId: slot.id,
  });

  return slot;
};

const markSlotDeleted = async (slotId: string) => {
  const slot = await prisma.availability.update({
    where: { id: slotId },
    data: { deleted: true },
  });

  broadcast(slot.tutorId, {
    type: "DELETED",
    slotId: slot.id,
  });

  return slot;
};



export const TutorService = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  getAvailability,
  setAvailability,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorBookings,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  addClient,
  removeClient,
  broadcast,
  markSlotBooked,
  markSlotOpen,
  markSlotDeleted,
};