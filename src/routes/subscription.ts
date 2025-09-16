import { Router } from "express";
import {
  getSubscriptionsByUserId,
  getSubscriptionsByCourseId,
  subscribe,
  unsubscribe,
} from "../controllers/subscription";
import { verifyCredentials } from "../middlewares/verifyCredentials";

const router = Router();

router.post("/", verifyCredentials(["student", "teacher"]), subscribe);

// router.put("/", verifyCredentials(["student", "teacher"]), updateSubscription);

router.delete("/", verifyCredentials(["student", "teacher"]), unsubscribe);

router.get(
  "/user/:userId",
  verifyCredentials(["student", "teacher"]),
  getSubscriptionsByUserId
);
router.get(
  "/course/:courseId",
  verifyCredentials(["student", "teacher"]),
  getSubscriptionsByCourseId
);

export default router;
