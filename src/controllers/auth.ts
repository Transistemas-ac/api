import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registrationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/(?=.*[a-zA-Z])(?=.*\d)/, {
      message: "Password must contain at least one letter and one number",
    }),
});

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registrationSchema.parse(req.body);

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      console.log("\nUsername not available on registration 🚫");
      return res.status(402).json("Username not available on registration 🚫");
    }
    if (existingUserByEmail) {
      console.log("\nEmail not available on registration 🚫");
      return res.status(403).json("Email not available on registration 🚫");
    }

    const hash = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });

    return res.status(200).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues.map((e) => e.message));
    }
    if (error instanceof Error) console.error(error.message);
    return res.status(500).json("An unexpected error occurred 🚫");
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(400).json("\nUser not found on login 🚫");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json("\nPassword incorrect 🚫");

  jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
    (err, token) => {
      return res.status(200).json({
        success: true,
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    }
  );
};

const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("user");
    res.clearCookie("token");
    return res.status(200).json("User logged out successfully ✅");
  } catch {
    return res.status(500).json("An error occurred during logout 🚫");
  }
};

export { register, login, logout };
