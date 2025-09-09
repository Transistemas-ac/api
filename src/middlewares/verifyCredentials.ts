import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

type Role = "admin" | "teacher" | "student" | "owner";

export function verifyCredentials(role: Role | Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("❌ No token provided");

    const token = authHeader.split(" ")[1];
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as {
        id: number;
        username: string;
        credentials: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.id) },
      });
      if (!user) return res.status(401).json("❌ User not found");

      const allowedRoles = Array.isArray(role) ? role : [role];

      // EARLY RETURN FOR ADMIN / TEACHER
      if (
        (allowedRoles.includes("admin") && user.credentials === "admin") ||
        (allowedRoles.includes("teacher") && user.credentials === "teacher")
      ) {
        req.user = {
          id: user.id,
          username: user.username,
          credentials: user.credentials,
          courses: [],
          subscriptions: [],
        };
        return next();
      }

      const subs = await prisma.subscription.findMany({
        where: { user_id: user.id },
        select: { course_id: true },
      });

      req.user = {
        id: user.id,
        username: user.username,
        credentials: user.credentials,
        courses: subs.map((s) => s.course_id),
        subscriptions: subs,
      };

      const userId = user.id;
      const targetUserIdRaw =
        req.params.userId ?? req.body.userId ?? req.query.userId;
      const targetUserId = targetUserIdRaw
        ? Number(targetUserIdRaw)
        : undefined;

      const getCourseId = () => {
        const raw =
          req.params?.courseId ?? req.body?.courseId ?? req.query?.courseId;
        return raw ? Number(raw) : undefined;
      };
      const courseId = getCourseId();

      for (const allowedRole of allowedRoles) {
        if (allowedRole === "student" && user.credentials === "student") {
          if (req.baseUrl.includes("/subscription") && req.method === "POST") {
            const targetUserIdPost = req.body.userId;
            if (!targetUserIdPost || Number(targetUserIdPost) !== user.id) {
              return res
                .status(403)
                .json("❌  Forbidden: Students can only enroll themselves");
            }
            return next();
          }
          if (
            req.baseUrl.includes("/subscription") &&
            req.method === "DELETE"
          ) {
            const targetUserIdDelete = req.body.userId;
            if (!targetUserIdDelete || Number(targetUserIdDelete) !== user.id) {
              return res
                .status(403)
                .json("❌ Forbidden: Students can only unsubscribe themselves");
            }
            return next();
          }
          if (courseId !== undefined && req.user.courses.includes(courseId)) {
            return next();
          }
          if (!courseId && !targetUserId) return next();
        }

        if (
          allowedRole === "owner" &&
          targetUserId !== undefined &&
          userId === targetUserId
        ) {
          return next();
        }
      }

      if (user.credentials === "student") {
        if (courseId !== undefined) {
          return res
            .status(403)
            .json("❌ Forbidden: Not enrolled in the course");
        }
        if (req.baseUrl.includes("/subscription")) {
          const subCourseIdRaw =
            req.params.courseId ?? req.body.courseId ?? req.query.courseId;
          if (subCourseIdRaw) {
            return res
              .status(403)
              .json("❌ Forbidden: Not enrolled in the course");
          }
          if (!subCourseIdRaw && req.method === "GET") {
            return res
              .status(400)
              .json("❌ Bad Request: Missing courseId parameter");
          }
        }
      }

      return res.status(403).json("Forbidden");
    } catch (err) {
      console.error("❌ JWT verification error:", err);
      return res.status(401).json("❌ Invalid token");
    }
  };
}
