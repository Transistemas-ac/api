import { Router } from "express";
import {
  getSubscriptionsByUserId,
  getSubscriptionsByCourseId,
  subscribe,
  unsubscribe,
} from "../controllers/subscription";

const router = Router();

router.get("/user/:userId", getSubscriptionsByUserId);
router.get("/course/:courseId", getSubscriptionsByCourseId);
router.post("/", subscribe);
router.delete("/", unsubscribe);

export default router;
