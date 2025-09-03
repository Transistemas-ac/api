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

router.get("/", verifyCredentials("admin"), getUsers);
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

router.post("/", verifyCredentials(["owner", "admin"]), createUser);
router.put("/:userId", verifyCredentials(["owner", "admin"]), updateUser);
router.delete("/:userId", verifyCredentials("admin"), deleteUser);

export default router;
