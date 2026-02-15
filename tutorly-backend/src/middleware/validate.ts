import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";


export const validate =
    (schema: ZodType) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body);
                next();
            } catch (error: any) {
                let parsedErrors = [];
                try {
                    parsedErrors = JSON.parse(error.message);
                } catch {
                    parsedErrors = [{ message: error.message }];
                }

                return res.status(400).json({
                    message: "Validation failed",
                    errors: parsedErrors,
                });
            }
        };
