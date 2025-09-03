import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserCourses,
  getUserSubscriptions,
} from "../controllers/user";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.get("/:userId/courses", getUserCourses);
router.get("/:userId/subscriptions", getUserSubscriptions);
router.post("/", createUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
