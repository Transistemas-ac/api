import { Router } from "express";
import { subscribe, unsubscribe } from "../controllers/subscription";

const router = Router();

router.post("/", (req, res) => {
  subscribe(req, res);
});

router.delete("/", (req, res) => {
  unsubscribe(req, res);
});

export default router;
