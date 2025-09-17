import { Router } from "express";
import {
  getSubscriptionsByUserId,
  getSubscriptionsByCourseId,
  subscribe,
  unsubscribe,
  getSubscriptions,
} from "../controllers/subscription";
import { verifyCredentials } from "../middlewares/verifyCredentials";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();

router.post(
  "/",
  verifyAuth,
  verifyCredentials(["student", "teacher"]),
  subscribe
);

// router.put("/", verifyAuth, verifyCredentials(["student", "teacher"]), updateSubscription);

router.delete(
  "/",
  verifyAuth,
  verifyCredentials(["student", "teacher"]),
  unsubscribe
);

router.get("/", getSubscriptions);
router.get("/user/:userId", getSubscriptionsByUserId);
router.get("/course/:courseId", getSubscriptionsByCourseId);

export default router;
