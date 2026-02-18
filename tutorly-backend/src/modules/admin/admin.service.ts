import { prisma } from "../../lib/prisma";

const listUsers = async (page: number, limit: number) => {
  return prisma.user.findMany({
    skip: (page -1)*limit,
    take: limit,
    select: {
      id: true,
      email: true,
      role: true,
      banned: true, 
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const banUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { banned: true },
  });
};

const unbanUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { banned: false },
  });
};

const promoteUser = async (id: string, role: "tutor" | "admin") => {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
};

const demoteUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { role: "student" },
  });
};

export const AdminService = {
  listUsers,
  banUser,
  unbanUser,
  promoteUser,
  demoteUser,
};