import { Router } from "express";
import { register, login, logout } from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/", (req, res) => {
  res.status(200).json({ message: "🏳️‍🌈 Transistemas API 🏳️‍⚧️" });
});

router.get("/healthz", (req, res) => {
  res.status(200).json({ message: "💚" });
});

router.get("/metrics", (req, res) => {
  res.status(200).json({
    cursos_dictados: 26,
    ayudas_sociales: 500,
    voluntaries: 19,
    egresades: 1789,
    personas_con_trabajo_registrado: 350,
  });
});

export default router;
