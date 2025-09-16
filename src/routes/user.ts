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

router.post("/", verifyCredentials(["teacher"]), createUser);

router.put("/:userId", verifyCredentials(["owner", "teacher"]), updateUser);

router.delete("/:userId", verifyCredentials(["owner", "teacher"]), deleteUser);

router.get("/", verifyCredentials(["admin", "teacher"]), getUsers);
router.get("/:userId", verifyCredentials(["owner", "teacher"]), getUserById);
router.get(
  "/:userId/courses",
  verifyCredentials(["owner", "teacher"]),
  getUserCourses
);
router.get(
  "/:userId/subscriptions",
  verifyCredentials(["owner", "teacher"]),
  getUserSubscriptions
);

export default router;
