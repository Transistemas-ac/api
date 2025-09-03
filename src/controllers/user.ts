import { Request, Response } from "express";
import prisma from "../libs/prisma";
import { asyncHandler } from "../libs/asyncHandler";
import { HttpError } from "../libs/HttpError";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { subscriptions: { include: { course: true } } },
  });
  res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.userId ?? req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { subscriptions: { include: { course: true } } },
  });
  if (!user) throw new HttpError(404, "User not found");
  res.status(200).json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const savedUser = await prisma.user.create({ data: req.body });
  res.status(201).json(savedUser);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.userId ?? req.params.id);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.status(200).json(updatedUser);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.userId ?? req.params.id);
  await prisma.user.delete({ where: { id } });
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
