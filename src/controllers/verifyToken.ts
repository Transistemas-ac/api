import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export const verifyToken = (
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
  next();
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
