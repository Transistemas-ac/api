// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ Error:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      errors: err.issues.map((e: any) => e.message),
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "🚫 Internal Server Error",
  });
}

export default errorHandler;
