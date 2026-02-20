import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { prisma } from "src/lib/prisma";

export const listUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  const users = await AdminService.listUsers(page, limit);
  const total = await prisma.user.count();

  res.json({
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};


const banUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await AdminService.banUser(id as string);
  res.json(user);
};

const unbanUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await AdminService.unbanUser(id as string);
  res.json(user);
};

const promoteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await AdminService.promoteUser(id as string, role);
  res.json(user);
};

const demoteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await AdminService.demoteUser(id as string);
  res.json(user);
};


const getStats = async (req: Request, res: Response) => {
  const totalUsers = await prisma.user.count();
  const totalTutors = await prisma.user.count({ where: { role: "tutor" } });
  const totalBookings = await prisma.booking.count();
  const totalCategories = await prisma.category.count();

  console.log("Stats:", { totalUsers, totalTutors, totalBookings, totalCategories });

  res.json({ totalUsers, totalTutors, totalBookings, totalCategories });
};


export const AdminController = {
  listUsers,
  banUser,
  unbanUser,
  promoteUser,
  demoteUser,
  getStats
};