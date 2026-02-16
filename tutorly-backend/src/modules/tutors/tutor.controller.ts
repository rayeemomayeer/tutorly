import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import { TutorFilters } from "./tutor.types";


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
  const { bio, hourlyRate, subjects } = req.body;
  const profile = await TutorService.updateTutorProfile(id as string, bio, hourlyRate, subjects);
  res.json(profile);
};

const deleteTutorProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  await TutorService.deleteTutorProfile(id as string);
  res.status(204).send();
};

export const TutorController = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile,
};