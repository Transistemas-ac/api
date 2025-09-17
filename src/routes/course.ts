import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course";
import { verifyAuth } from "../middlewares/verifyAuth";
import { verifyCredentials } from "../middlewares/verifyCredentials";

const router = Router();

router.get("/", getCourses);
router.get("/:courseId", getCourseById);

router.post("/", verifyAuth, verifyCredentials(["teacher"]), createCourse);

router.put(
  "/:courseId",
  verifyAuth,
  verifyCredentials(["teacher"]),
  updateCourse
);

router.delete(
  "/:courseId",
  verifyAuth,
  verifyCredentials(["teacher"]),
  deleteCourse
);

export default router;
