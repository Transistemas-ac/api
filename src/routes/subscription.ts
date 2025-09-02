import { Router } from "express";
import {
  getSubscriptionsByUserId,
  getSubscriptionsByCourseId,
  subscribe,
  unsubscribe,
} from "../controllers/subscription";

const router = Router();

router.get("/user/:userId", (req, res) => {
  getSubscriptionsByUserId(req, res);
});

router.get("/course/:courseId", (req, res) => {
  getSubscriptionsByCourseId(req, res);
});

router.post("/", (req, res) => {
  subscribe(req, res);
});

router.delete("/", (req, res) => {
  unsubscribe(req, res);
});

export default router;
