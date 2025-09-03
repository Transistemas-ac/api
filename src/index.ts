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
import { verifyCredentials } from "./middlewares/verifyCredentials";

const app = express();

//⚙️ Define middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

//🚦 Define routes
app.use("/", authRoutes);
app.use("/user", verifyAuth, verifyCredentials, userRoutes);
app.use("/course", verifyAuth, verifyCredentials, courseRoutes);
app.use("/subscription", verifyAuth, verifyCredentials, subscriptionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "🏳️‍🌈 Transistemas API 🏳️‍⚧️" });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ message: "💚" });
});

//❌ Error handler middleware
app.use(errorHandler);

//🗃️ Connect to the database and start the server
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
app.use(errorHandler);

export default app;
