import { Router } from "express";
import { AdminController } from "./admin.controller";
import authMiddleware from "src/middleware/authMiddleware";

const adminRouter = Router();


adminRouter.get("/users", authMiddleware("user", "list"), AdminController.listUsers);


adminRouter.patch("/users/:id/ban", authMiddleware("user", "ban"), AdminController.banUser);


adminRouter.patch("/users/:id/unban", authMiddleware("user", "unban"), AdminController.unbanUser);


adminRouter.patch("/users/:id/promote", authMiddleware("user", "promote"), AdminController.promoteUser);


adminRouter.patch("/users/:id/demote", authMiddleware("user", "demote"), AdminController.demoteUser);

export default adminRouter;