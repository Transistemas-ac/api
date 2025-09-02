import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course";

const router = Router();

router.get("/", (req, res) => {
  getCourses(req, res);
});

router.get("/:id", (req, res) => {
  getCourseById(req, res);
});

router.post("/", (req, res) => {
  createCourse(req, res);
});

router.put("/:id", (req, res) => {
  updateCourse(req, res);
});

router.delete("/:id", (req, res) => {
  deleteCourse(req, res);
});

export default router;
