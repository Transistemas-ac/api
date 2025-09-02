import { Request, Response } from "express";
import prisma from "../libs/prisma";

// Get all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const course = await prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const savedCourse = await prisma.course.create({
      data: req.body,
    });
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
};

// Update a course by ID
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedCourse);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(400).json({ message: "Bad request", error });
  }
};

// Delete a course by ID
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.course.delete({
      where: { id },
    });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
