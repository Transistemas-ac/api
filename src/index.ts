import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import cors from "cors";
import { register, login, logout } from "./controllers/auth";
import { verifyToken } from "./controllers/verifyToken";
import { connectDB } from "./libs/db";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Add a health check endpoint for deployment platforms
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Start server after routes are defined
connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(Number(process.env.PORT), "0.0.0.0", () => {
      console.log(`💚 app is running on 🔌 port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  });

app.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

app.post("/register", (req, res) => {
  register(req, res);
});

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/logout", (req, res) => {
  logout(req, res);
});
