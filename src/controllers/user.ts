import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        courses: {
          include: { course: true },
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        courses: {
          include: { course: true },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const savedUser = await prisma.user.create({
      data: req.body,
    });
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(400).json({ message: "Bad request", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(400).json({ message: "Bad request", error });
  }
};

// Get all courses for a user
export const getUserCourses = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const courses = await prisma.inscription.findMany({
      where: { user_id: id },
      include: { course: true },
    });
    res.status(200).json(courses.map((c: { course: any }) => c.course));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserCourses,
};
