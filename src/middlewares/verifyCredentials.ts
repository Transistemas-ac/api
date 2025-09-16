import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

type Credentials = "teacher" | "student" | "owner";

export function verifyCredentials(credentials: Credentials | Credentials[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Obtener header de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json("❌ No token provided");
    }

    // Intentamos extraer el token (asume formato "Bearer <token>" o similar).
    // Si no hay segunda parte, token será undefined y jwt.verify fallará y caerá en el catch.
    const token = authHeader.split(" ")[1];

    try {
      // --- Verificar y decodificar JWT ---
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as {
        id: number;
        username: string;
        credentials: string;
      };

      // --- Buscar usuario en DB por id del token ---
      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.id) },
      });

      // Si no se encuentra el usuario, respondemos con 401
      if (!user) {
        return res.status(401).json("❌ User not found");
      }

      // --- Normalizar allowedCredentials en arreglo ---
      const allowedCredentials = Array.isArray(credentials)
        ? credentials
        : [credentials];

      // --- Caso especial: si se permite "teacher" y el usuario es teacher otorgamos acceso inmediato ---
      if (
        allowedCredentials.includes("teacher") &&
        user.credentials === "teacher"
      ) {
        // Adjuntamos los datos mínimos al request para uso posterior
        (req as any).user = {
          id: user.id,
          username: user.username,
          credentials: user.credentials,
          courses: [],
          subscriptions: [],
        };
        return next();
      }

      // --- Obtener suscripciones del usuario (lista de course_id) ---
      const subs = await prisma.subscription.findMany({
        where: { user_id: user.id },
        select: { course_id: true },
      });

      // Adjuntamos la info del usuario al request
      (req as any).user = {
        id: user.id,
        username: user.username,
        credentials: user.credentials,
        courses: subs.map((s) => s.course_id), // cursos: sólo ids
        subscriptions: subs,
      };

      // --- Preparar variables para validaciones ---
      const userId = user.id;
      const targetUserId = req.params.userId
        ? Number(req.params.userId)
        : req.body.userId;
      const courseId = req.params.courseId
        ? Number(req.params.courseId)
        : req.body.courseId;

      // --- Comprobaciones por cada credential permitida ---
      for (const credential of allowedCredentials) {
        // Reglas para "student"
        if (credential === "student" && user.credentials === "student") {
          // Caso especial: suscribirse a curso (POST /subscription)
          if (req.baseUrl.includes("/subscription") && req.method === "POST") {
            const targetUserIdPost = req.body.userId;
            // Confirmar que el usuarix se inscribe a sí mismx
            if (!targetUserIdPost || Number(targetUserIdPost) !== user.id) {
              return res
                .status(403)
                .json("❌  Forbidden: Students can only enroll themselves");
            }
            return next();
          }

          // Caso especial: desuscribirse (DELETE /subscription)
          if (
            req.baseUrl.includes("/subscription") &&
            req.method === "DELETE"
          ) {
            const targetUserIdDelete = req.body.userId;
            // Confirmar que el usuarix se desuscribe a sí mismx
            if (!targetUserIdDelete || Number(targetUserIdDelete) !== user.id) {
              return res
                .status(403)
                .json("❌ Forbidden: Students can only unsubscribe themselves");
            }
            return next();
          }

          // Si se proporciona courseId, comprobar que el usuarix esté suscripto
          if (
            courseId !== undefined &&
            (req as any).user.courses.includes(courseId)
          ) {
            return next();
          }

          // Permitir acceso si no hay courseId ni targetUserId en la petición
          if (!courseId && !targetUserId) return next();
        }

        // Reglas para "owner"
        // Si credential es owner y el usuarix es el propio targetUserId => ok
        if (
          credential === "owner" &&
          targetUserId !== undefined &&
          userId === targetUserId
        ) {
          return next();
        }
      }

      // --- Manejo de errores / casos donde student intenta acceder a cursos no autorizados ---
      if (user.credentials === "student") {
        if (courseId !== undefined) {
          return res
            .status(403)
            .json("❌ Forbidden: Not enrolled in the course");
        }

        if (req.baseUrl.includes("/subscription")) {
          // Intentamos recuperar courseId desde params, body o query
          const subCourseIdRaw =
            req.params.courseId ?? req.body.courseId ?? req.query.courseId;

          if (subCourseIdRaw) {
            return res
              .status(403)
              .json("❌ Forbidden: Not enrolled in the course");
          }

          // Si no hay courseId y el método es GET, retornamos Bad Request
          if (!subCourseIdRaw && req.method === "GET") {
            return res
              .status(400)
              .json("❌ Bad Request: Missing courseId parameter");
          }
        }
      }

      // --- Si ninguna condición anterior permitió el acceso, denegamos ---
      return res.status(403).json("Forbidden");
    } catch (err) {
      // Log detallado para depuración
      console.error("❌ JWT verification error:", err);
      return res.status(401).json("❌ Invalid token");
    }
  };
}
