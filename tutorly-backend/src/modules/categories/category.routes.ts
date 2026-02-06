import { Router } from "express";
import { CategoryController } from "./category.controller";
import { requireRole } from "src/middleware/authMiddleware";

const router = Router();

router.get("/", CategoryController.getAllCategories);
router.post("/", requireRole("ADMIN"), CategoryController.createCategory);
router.put("/:id", requireRole("ADMIN"), CategoryController.updateCategory);

export default router;