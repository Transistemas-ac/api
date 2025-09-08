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
import { verifyCredentials } from "../middlewares/verifyCredentials";

const router = Router();

router.get("/", verifyCredentials(["admin", "teacher"]), getUsers);
router.get(
  "/:userId",
  verifyCredentials(["owner", "teacher", "admin"]),
  getUserById
);
router.get(
  "/:userId/courses",
  verifyCredentials(["owner", "teacher", "admin"]),
  getUserCourses
);
router.get(
  "/:userId/subscriptions",
  verifyCredentials(["owner", "teacher", "admin"]),
  getUserSubscriptions
);

router.post("/", verifyCredentials(["teacher", "admin"]), createUser);
router.put(
  "/:userId",
  verifyCredentials(["owner", "teacher", "admin"]),
  updateUser
);
router.delete(
  "/:userId",
  verifyCredentials(["owner", "teacher", "admin"]),
  deleteUser
);

export default router;
