import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { HttpError } from "../libs/HttpError";
import { asyncHandler } from "../libs/asyncHandler";

const prisma = new PrismaClient();

const registrationSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/(?=.*[a-zA-Z])(?=.*\d)/),
  credentials: z.enum(["student", "teacher"]).default("student"),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, credentials } = registrationSchema.parse(
    req.body
  );

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser)
    throw new HttpError(409, "❌ Email or username already registered");

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, password: hash, credentials },
  });

  console.log("✅ User registered successfully", {
    id: user.id,
    username: user.username,
    email: user.email,
    credentials: user.credentials,
  });

  // omit password
  const { password: _pw, ...safeUser } = user;

  res.status(201).json({
    success: true,
    user: safeUser,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new HttpError(404, "❌ User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new HttpError(401, "❌ Password incorrect");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new HttpError(500, "❌ JWT_SECRET not configured");

  const token = jwt.sign(
    { id: user.id, username: user.username, credentials: user.credentials },
    secret,
    { expiresIn: "7d" }
  );

  console.log("✅ User logged in successfully", {
    id: user.id,
    username: user.username,
    email: user.email,
    credentials: user.credentials,
  });

  // omit password
  const { password: _pw, ...safeUser } = user;

  res.status(200).json({
    success: true,
    token,
    user: safeUser,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { username } = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new HttpError(404, "❌ User not found");

  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "✅ User logged out successfully" });
});
