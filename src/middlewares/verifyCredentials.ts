import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

export function verifyCredentials(
  role:
    | "admin"
    | "teacher"
    | "student"
    | "owner"
    | ("admin" | "teacher" | "student" | "owner")[]
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("No token provided 🚫");

    const token = authHeader.split(" ")[1];
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as {
        id: number;
        username: string;
        credentials: string;
      };

      // Get full user data
      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.id) },
      });
      if (!user) {
        return res.status(401).json("User not found 🚫");
      }
      const subs = await prisma.subscription.findMany({
        where: { user_id: user.id },
        select: { course_id: true, user_id: true },
      });

      // Attach enriched user data
      (req as any).user = {
        id: user.id,
        username: user.username,
        credentials: user.credentials,
        courses: subs.map((s) => s.course_id),
        subscriptions: subs,
      };

      // Handle both single role and array of roles
      const allowedRoles = Array.isArray(role) ? role : [role];

      const userCredentials = user.credentials;
      const userId = Number(user.id);

      // Get parameters from request
      const targetUserIdRaw =
        req.params.userId ?? req.body.userId ?? req.query.userId;
      const targetUserId = targetUserIdRaw
        ? Number(targetUserIdRaw)
        : undefined;

      const getCourseId = () => {
        const raw =
          req.params.courseId ?? req.body.courseId ?? req.query.courseId;
        return raw ? Number(raw) : undefined;
      };
      const courseId = getCourseId();

      // Check each allowed role
      for (const allowedRole of allowedRoles) {
        // Admin access
        if (allowedRole === "admin" && userCredentials === "admin") {
          return next();
        }

        // Teacher access
        if (allowedRole === "teacher" && userCredentials === "teacher") {
          return next();
        }

        // Student access
        if (allowedRole === "student" && userCredentials === "student") {
          // For course-specific endpoints, check enrollment
          if (courseId !== undefined) {
            const enrolledCourses = subs.map((s) => s.course_id);
            if (enrolledCourses.includes(courseId)) {
              return next();
            }
          }
          // For subscription endpoints, check course enrollment
          else if (req.baseUrl && req.baseUrl.includes("/subscription")) {
            const subCourseIdRaw =
              req.params.courseId ?? req.body.courseId ?? req.query.courseId;
            if (subCourseIdRaw) {
              const subCourseId = Number(subCourseIdRaw);
              const enrolledCourses = subs.map((s) => s.course_id);
              if (enrolledCourses.includes(subCourseId)) {
                return next();
              }
            } else if (
              !subCourseIdRaw &&
              (req.method === "POST" || req.method === "DELETE")
            ) {
              // Allow subscribe/unsubscribe without courseId in URL
              return next();
            }
          }
          // For general student access (no specific course)
          else if (courseId === undefined && targetUserId === undefined) {
            return next();
          }
        }

        // Owner access - user accessing their own resources
        if (
          allowedRole === "owner" &&
          targetUserId !== undefined &&
          userId === targetUserId
        ) {
          return next();
        }
      }

      // Special error messages for students
      if (userCredentials === "student") {
        if (courseId !== undefined) {
          return res
            .status(403)
            .json("Forbidden: Not enrolled in the course 🚫");
        }
        if (req.baseUrl && req.baseUrl.includes("/subscription")) {
          const subCourseIdRaw =
            req.params.courseId ?? req.body.courseId ?? req.query.courseId;
          if (subCourseIdRaw) {
            return res
              .status(403)
              .json("Forbidden: Not enrolled in the course 🚫");
          }
          if (!subCourseIdRaw && req.method === "GET") {
            return res
              .status(400)
              .json("Bad Request: Missing courseId parameter 🚫");
          }
        }
      }

      return res.status(403).json("Forbidden 🚫");
    } catch {
      return res.status(401).json("Invalid token 🚫");
    }
  };
}

export default verifyCredentials;
