import { Router } from "express";
import {
  getSubscriptionsByUserId,
  getSubscriptionsByCourseId,
  subscribe,
  unsubscribe,
} from "../controllers/subscription";
import { verifyCredentials } from "../middlewares/verifyCredentials";

const router = Router();

router.get(
  "/user/:userId",
  verifyCredentials(["student", "teacher", "admin"]),
  getSubscriptionsByUserId
);
router.get(
  "/course/:courseId",
  verifyCredentials(["student", "teacher", "admin"]),
  getSubscriptionsByCourseId
);
router.post("/", verifyCredentials(["student", "teacher", "admin"]), subscribe);
router.delete(
  "/",
  verifyCredentials(["student", "teacher", "admin"]),
  unsubscribe
);

export default router;
