import "./libs/envSetup";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import subscriptionRoutes from "./routes/subscription";
import { verifyToken } from "./controllers/verifyToken";
import { connectDB } from "./libs/db";

const app = express();

//⚙️ Define middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

//🚦 Define routes
app.use("/", authRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/course", verifyToken, courseRoutes);
app.use("/subscription", verifyToken, subscriptionRoutes);

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
