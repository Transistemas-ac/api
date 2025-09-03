import { Request, Response } from "express";
import prisma from "../libs/prisma";
import { asyncHandler } from "../libs/asyncHandler";
import { HttpError } from "../libs/HttpError";

export const getCourses = asyncHandler(async (_req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { subscriptions: { include: { user: true } } },
  });
  res.status(200).json(courses);
});

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.courseId ?? req.params.id);
    const course = await prisma.course.findUnique({
      where: { id },
      include: { subscriptions: { include: { user: true } } },
    });
    if (!course) throw new HttpError(404, "Course not found");
    res.status(200).json(course);
  }
);

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const savedCourse = await prisma.course.create({ data: req.body });
    res.status(201).json(savedCourse);
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.courseId ?? req.params.id);
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedCourse);
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.courseId ?? req.params.id);
    await prisma.course.delete({ where: { id } });
    res.status(200).json({ message: "Course deleted successfully" });
  }
);
