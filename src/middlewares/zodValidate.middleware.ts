import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { createErrorResponse } from "../utils/responseHelper.utils.js";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
        const issues = error.errors || error.issues;
        const firstError = issues?.[0]?.message || "Invalid request data";
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(firstError));
      }
      
  };
