import { Request, Response } from "express";
import { CategoryService } from "./category.service";

const getAllCategories = async (req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
}

const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await CategoryService.createCategory(name);
    res.json(category);
}

const updateCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CategoryService.updateCategory(id as string, name);
    res.json(category);
}


export const CategoryController = {
    getAllCategories,
    createCategory,
    updateCategory
}