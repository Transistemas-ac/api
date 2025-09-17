import { Request, Response } from "express";
import { asyncHandler } from "../libs/asyncHandler";
import { HttpError } from "../libs/HttpError";
import prisma from "../libs/prisma";

export const getSubscriptionsByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId ?? req.params.id);
    const subs = await prisma.subscription.findMany({
      where: { user_id: userId },
      include: { course: true },
    });
    if (!subs.length) {
      return res
        .status(404)
        .json({ message: "❌ No subscriptions found for this user" });
    }
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
    if (!subs.length) {
      return res
        .status(404)
        .json({ message: "❌ No subscriptions found for this course" });
    }

    const safeUsers = subs.map((s) => {
      if (s.user && typeof s.user === "object") {
        const { password, ...userWithoutPassword } = s.user as any;
        return userWithoutPassword;
      }
      return s.user;
    });

    res.status(200).json(safeUsers);
  }
);

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { userId, courseId, role } = req.body;

  const course = await prisma.course.findUnique({
    where: { id: Number(courseId) },
  });
  if (!course) throw new HttpError(404, "❌ Course not found");

  try {
    const relation = await prisma.subscription.create({
      data: {
        user_id: Number(userId),
        course_id: Number(courseId),
        credentials: role ?? "student",
      },
    });
    console.log("✅ User enrolled in course", relation);
    res.status(201).json(relation);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json("❌ Conflict: User is already enrolled in this course");
    }
    throw err;
  }
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;

  const course = await prisma.course.findUnique({
    where: { id: Number(courseId) },
  });
  if (!course) throw new HttpError(404, "❌ Course not found");

  try {
    await prisma.subscription.delete({
      where: {
        user_id_course_id: {
          user_id: Number(userId),
          course_id: Number(courseId),
        },
      },
    });

    res.status(200).json({ message: "✅ User removed from course" });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json("🚫 Not Found: Subscription does not exist");
    }
    throw err;
  }
});
