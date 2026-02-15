import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const listUsers = async (req: Request, res: Response) => {
  const users = await AdminService.listUsers();
  res.json(users);
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

export const AdminController = {
  listUsers,
  banUser,
  unbanUser,
  promoteUser,
  demoteUser,
};