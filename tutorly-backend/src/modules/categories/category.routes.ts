import { Router } from "express";
import { CategoryController } from "./category.controller";
import authMiddleware from "src/middleware/authMiddleware";

const categoryRouter = Router();

categoryRouter.get("/",authMiddleware("category", "read"), CategoryController.getAllCategories);

categoryRouter.post("/", authMiddleware("category", "create"), CategoryController.createCategory);

categoryRouter.put("/:id", authMiddleware("category", "update"), CategoryController.updateCategory);

export default categoryRouter;