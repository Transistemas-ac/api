// Load environment variables from .env file in development environments
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import coursesRoutes from "./routes/courses";
import { verifyToken } from "./controllers/verifyToken";
import { connectDB } from "./libs/db";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

//❤️‍🩹 Health check endpoint for deployment platforms
if (process.env.NODE_ENV === "production") {
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });
}

//🚦 Define routes
app.use("/", authRoutes);
app.use("/userss", verifyToken, usersRoutes);
app.use("/courses", verifyToken, coursesRoutes);

app.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "🏳️‍🌈 Transistemas API 🏳️‍⚧️" });
});

//🗃️ Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("🗃️ Connected to the database successfully");

    const port = process.env.PORT || 3000;
    app.listen(Number(process.env.PORT), "0.0.0.0", () => {
      console.log(`💚 App is running on 🔌 port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  });

export default app;
