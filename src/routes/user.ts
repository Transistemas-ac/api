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
import { verifyAuth } from "../middlewares/verifyAuth";
import { verifyCredentials } from "../middlewares/verifyCredentials";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.get("/:userId/courses", getUserCourses);
router.get("/:userId/subscriptions", getUserSubscriptions);

router.post("/", verifyAuth, verifyCredentials(["teacher"]), createUser);

router.put(
  "/:userId",
  verifyAuth,
  verifyCredentials(["owner", "teacher"]),
  updateUser
);

router.delete(
  "/:userId",
  verifyAuth,
  verifyCredentials(["owner", "teacher"]),
  deleteUser
);

export default router;
