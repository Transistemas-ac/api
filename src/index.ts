import "./libs/envSetup";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import subscriptionRoutes from "./routes/subscription";
import { connectDB } from "./libs/db";
import { errorHandler } from "./middlewares/errorHandler";
import { verifyAuth } from "./middlewares/verifyAuth";

const app = express();

//⚙️ Define middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

//🚦 Define routes
app.use("/", authRoutes);
app.use("/user", verifyAuth, userRoutes);
app.use("/course", courseRoutes);
app.use("/subscription", verifyAuth, subscriptionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "🏳️‍🌈 Transistemas API 🏳️‍⚧️" });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ message: "💚" });
});

//❗ Error handler
app.use(errorHandler);

//🗃️ Connect DB and start server only if not in test
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      const port = Number(process.env.PORT) || 3000;
      app.listen(port, "0.0.0.0", () => {
        console.log(`💚 App is running on port ${port}`);
      });
    })
    .catch((err: Error) => {
      console.error("❌ Failed to connect to database", err);
      process.exit(1);
    });
}

export default app;
