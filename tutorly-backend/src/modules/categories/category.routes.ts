import { Router } from "express";
import { CategoryController } from "./category.controller";
import authMiddleware from "src/middleware/authMiddleware";
import { validate } from "src/middleware/validate";
import { createCategorySchema, updateCategorySchema } from "src/validations/category.validation";

const categoryRouter = Router();

categoryRouter.get("/", authMiddleware("category", "read"), CategoryController.getAllCategories);

categoryRouter.post("/", authMiddleware("category", "create"), validate(createCategorySchema), CategoryController.createCategory);

categoryRouter.put("/:id", authMiddleware("category", "update"), validate(updateCategorySchema), CategoryController.updateCategory);

categoryRouter.delete(
    "/:id",
    authMiddleware("category", "delete"),
    CategoryController.deleteCategory
);


export default categoryRouter;