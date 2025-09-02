import dotenv from "dotenv";

// Self-ping mechanism to keep the app alive on Render
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch(`http://localhost:${process.env.PORT || 3000}/health`)
      .then(() => console.log("💚 Self-ping successful"))
      .catch((err) => console.error("❌ Self-ping failed", err));
  }, 40000); // every 40 seconds
}
// Load environment variables from .env file in development environment
else {
  dotenv.config();
}

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import subscriptionRoutes from "./routes/subscription";
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
app.use("/user", verifyToken, userRoutes);
app.use("/course", verifyToken, courseRoutes);
app.use("/subscription", verifyToken, subscriptionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "🏳️‍🌈 Transistemas API 🏳️‍⚧️" });
});

//🗃️ Connect to the database and start the server
connectDB()
  .then(() => {
    const port = Number(process.env.PORT) || 3000;

    app.listen(port, "0.0.0.0", () => {
      console.log(`💚 App is running on 🔌 port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  });

export default app;
