import { Request, Response, NextFunction } from "express";
import { auth as betterAuth } from "../lib/auth";
import { ac } from "src/lib/permissions";

const authMiddleware = (resource: keyof typeof ac.statements, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
      const session = await betterAuth.api.getSession({
        headers: new Headers(
          Object.entries(req.headers).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(",") : value ?? ""
          ])
        )
      });

      if (!session) return res.status(401).send("Unauthorized");
      const hasPermission = await betterAuth.api.userHasPermission({
        body: {
          userId: session.user.id,
          role: session.user.role || "user" as any,
          permission: { [resource]: [action] }
        }
      })

      if (!hasPermission || !hasPermission.success) return res.status(403).send("Forbidden");

      next();
    } catch (error) {
      console.error(error);
    }
  };
};

export default authMiddleware;