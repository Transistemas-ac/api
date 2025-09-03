// src/middleware/requireCredentials.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireCredentials(role: "admin" | "teacher" | "student") {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("No token provided 🚫");

    const token = authHeader.split(" ")[1];
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as {
        id: number;
        username: string;
        credentials: string;
      };

      if (decoded.credentials !== role) {
        return res.status(403).json("Forbidden 🚫");
      }

      // attach user info to req
      (req as any).user = decoded;
      next();
    } catch {
      return res.status(401).json("Invalid token 🚫");
    }
  };
}
