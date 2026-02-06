import { prisma } from "../../config/db";

const getAllCategories = async () => {
    return prisma.category.findMany();
}

const createCategory = async (name: string) => {
    return prisma.category.create({ data: { name } });
}

const updateCategory = async (id: string, name: string) => {
    return prisma.category.update({ where: { id }, data: { name } });
}

export const CategoryService = {
    getAllCategories,
    createCategory,
    updateCategory
}