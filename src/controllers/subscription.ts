import { Request, Response } from "express";
import prisma from "../libs/prisma";

// Get all subscriptions for a specific user
export const getSubscriptionsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const courses = await prisma.subscription.findMany({
      where: { user_id: userId },
      include: {
        course: true,
      },
    });
    res.status(200).json(courses.map((c: { course: any }) => c.course));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all subscriptions for a specific course
export const getSubscriptionsByCourseId = async (
  req: Request,
  res: Response
) => {
  try {
    const courseId = Number(req.params.courseId);
    const subscriptions = await prisma.subscription.findMany({
      where: { course_id: courseId },
      include: {
        user: true,
      },
    });
    res.status(200).json(subscriptions.map((s: { user: any }) => s.user));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a user to a course
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, role } = req.body;
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const relation = await prisma.subscription.create({
      data: {
        user_id: userId,
        course_id: courseId,
        role,
      },
    });
    res.status(200).json(relation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove a user from a course
export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    await prisma.subscription.delete({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });
    res.status(200).json({ message: "User removed from course" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Relation not found" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  getSubscriptionsByUserId,
  getSubscriptionsByCourseId,
  subscribe,
  unsubscribe,
};
