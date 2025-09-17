import "./libs/envSetup";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import subscriptionRoutes from "./routes/subscription";
import { connectDB } from "./libs/db";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

//⚙️ Define middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

//🚦 Define routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/subscription", subscriptionRoutes);
app.use(errorHandler); //❗ (must be last)

//🚀 Start server after DB connection
connectDB().then(() => {
  const port = Number(process.env.PORT) || 3000;
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 El servidor se está ejecutando en el puerto ${port}`);
    });
  } catch (err) {
    console.error(`❌ Error al iniciar el servidor en el puerto ${port}`, err);
    process.exit(1);
  }
});

export default app;
