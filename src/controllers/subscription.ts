import { Request, Response } from "express";
import prisma from "../libs/prisma";
import { asyncHandler } from "../libs/asyncHandler";
import { HttpError } from "../libs/HttpError";

export const getSubscriptionsByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId ?? req.params.id);
    const subs = await prisma.subscription.findMany({
      where: { user_id: userId },
      include: { course: true },
    });
    res.status(200).json(subs.map((s) => s.course));
  }
);

export const getSubscriptionsByCourseId = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = Number(req.params.courseId ?? req.params.id);
    const subs = await prisma.subscription.findMany({
      where: { course_id: courseId },
      include: { user: true },
    });
    res.status(200).json(subs.map((s) => s.user));
  }
);

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { userId, courseId, role } = req.body;

  const course = await prisma.course.findUnique({
    where: { id: Number(courseId) },
  });
  if (!course) throw new HttpError(404, "Course not found");

  const relation = await prisma.subscription.create({
    data: {
      user_id: Number(userId),
      course_id: Number(courseId),
      credentials: role ?? "student",
    },
  });

  res.status(201).json(relation);
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;

  await prisma.subscription.delete({
    where: {
      user_id_course_id: {
        user_id: Number(userId),
        course_id: Number(courseId),
      },
    },
  });

  res.status(200).json({ message: "User removed from course" });
});
