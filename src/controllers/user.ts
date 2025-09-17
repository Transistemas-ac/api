import { Request, Response } from "express";
import { asyncHandler } from "../libs/asyncHandler";
import { HttpError } from "../libs/HttpError";
import prisma from "../libs/prisma";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { subscriptions: { include: { course: true } } },
  });

  if (!users.length) throw new HttpError(404, "❌ No users found");

  const safeUsers = users.map(({ password, ...rest }) => rest);

  res.status(200).json(safeUsers);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.userId ?? req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { subscriptions: { include: { course: true } } },
  });
  if (!user) throw new HttpError(404, "❌ User not found");

  const { password, ...safeUser } = user;
  res.status(200).json(safeUser);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const savedUser = await prisma.user.create({ data: req.body });
  console.log("✅ User created successfully");

  const { password, ...safeUser } = savedUser;
  res.status(201).json(safeUser);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.userId ?? req.params.id);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  console.log("✅ User updated successfully");

  const { password, ...safeUser } = updatedUser;
  res.status(200).json(safeUser);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.userId ?? req.params.id);
  await prisma.user.delete({ where: { id } });
  console.log("✅ User deleted successfully");
  res.status(204).send();
});

export const getUserCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.userId ?? req.params.id);
    const courses = await prisma.subscription.findMany({
      where: { user_id: id },
      include: { course: true },
    });
    res.status(200).json(courses.map((c) => c.course));
  }
);

export const getUserSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.userId ?? req.params.id);
    const subscriptions = await prisma.subscription.findMany({
      where: { user_id: id },
      include: { course: true },
    });
    res.status(200).json(subscriptions);
  }
);
