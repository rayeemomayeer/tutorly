import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { TutorFilters } from "./tutor.types";
import config from "src/config/env";


const getAllTutors = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filters: TutorFilters = {
    categoryId: req.query.categoryId as string | undefined,
    minRate: req.query.minRate ? parseInt(req.query.minRate as string) : undefined,
    maxRate: req.query.maxRate ? parseInt(req.query.maxRate as string) : undefined,
    search: req.query.search as string | undefined,
  };

  const result = await TutorService.getAllTutors(page, limit, filters);
  res.json(result);
};

const getFeaturedTutors = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 3;
  const tutors = await TutorService.getFeaturedTutors(limit);

  res.json({ data: tutors });
};

const getTutorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tutor = await TutorService.getTutorById(id as string);
  res.json(tutor);
};

const createTutorProfile = async (req: Request, res: Response) => {
  const { bio, hourlyRate, subjects } = req.body;
  const userId = (req as any).session?.user.id;
  const profile = await TutorService.createTutorProfile(userId, bio, hourlyRate, subjects);
  res.status(201).json(profile);
};

const updateTutorProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, hourlyRate, categories } = req.body; 

  const profile = await TutorService.updateTutorProfile(
    id as string,
    bio,
    hourlyRate,
    categories
  );

  res.json(profile);
};

const deleteTutorProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  await TutorService.deleteTutorProfile(id as string);
  res.status(204).send();
};

const getAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const availability = await TutorService.getAvailability(id as string);
  res.json(availability);
};

const setAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const slots = req.body; 
  const updated = await TutorService.setAvailability(id as string, slots);
  res.status(201).json(updated);
};

const updateAvailabilitySlot = async (req: Request, res: Response) => {
  const { tutorId, slotId } = req.params;
  const { dayOfWeek, startTime, endTime } = req.body;
  const updated = await TutorService.updateAvailabilitySlot(tutorId as string, slotId as string, dayOfWeek, startTime, endTime);
  res.json(updated);
};

const deleteAvailabilitySlot = async (req: Request, res: Response) => {
  const { slotId } = req.params;
  await TutorService.markSlotDeleted(slotId as string);
  res.status(200).json({ message: "Slot deleted (soft delete)" });
};


const streamAvailability = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", config.APP_URL || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.flushHeaders();

  const tutorId = req.params.id;
  TutorService.addClient(tutorId as string, res);

  // heartbeat every 10s
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: "PING" })}\n\n`);
  }, 10000);

  req.on("close", () => {
    clearInterval(interval);
    TutorService.removeClient(tutorId as string, res);
  });
};




const getTutorBookings = async (req: Request, res: Response) => {
  const { id } = req.params;

  const bookings = await TutorService.getTutorBookings(id as string);

  res.json(bookings);
};

export const TutorController = {
  getAllTutors,
  getFeaturedTutors,
  getTutorById,
  createTutorProfile,
  getAvailability,
  setAvailability,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorBookings,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  streamAvailability,
};
