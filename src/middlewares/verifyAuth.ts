import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: any;
    }
  }
}

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(403);
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(403);
    return;
  }

  req.token = token;

  try {
    const secret = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const subs = await prisma.subscription.findMany({
      where: { user_id: user.id },
      select: { course_id: true, user_id: true },
    });
    req.user = {
      id: user.id,
      credentials: user.credentials,
      courses: subs.map((s) => s.course_id),
      subscriptions: subs,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err });
  }
};

export const signToken = (
  payload: { id: string },
  secret: string,
  options: jwt.SignOptions
) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
};
