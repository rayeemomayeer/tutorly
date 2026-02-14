import { auth } from "../lib/auth";
import { Request, Response, NextFunction } from "express";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {

  const session = (req as any).auth?.session;
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = session.user as { id: string; email: string; role: string };
  next();
}

export function requireRole(role: "ADMIN" | "TUTOR" | "STUDENT") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}