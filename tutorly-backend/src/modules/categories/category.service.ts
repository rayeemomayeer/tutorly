import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
    return prisma.category.findMany();
}

const createCategory = async (name: string) => {

    try {
        return await prisma.category.create({
            data: { name: name.trim().toLowerCase() },
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            throw new Error("Category already exists");
        }
        throw error;
    }
}

const updateCategory = async (id: string, name: string) => {

    try {
        return await prisma.category.update({
            where: { id },
            data: { name: name.trim().toLowerCase() },
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            throw new Error("Category already exists");
        }
        throw error;
    }
}

const deleteCategory = async (id: string) => {
    return prisma.category.delete({ where: { id } });
};



export const CategoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}