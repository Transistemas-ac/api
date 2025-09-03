import { Request, Response, NextFunction, RequestHandler } from "express";
import { fromPrismaError } from "./HttpError";

// A utility to wrap async route handlers and pass errors to Express error handler
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      if (error?.code) return next(fromPrismaError(error));
      next(error);
    }
  };
}
