import dotenv from "dotenv";
dotenv.config();

// Self-ping to keep the app awake on Render
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch(`${process.env.SELF_URL}/health`)
      .then(() => console.log("💚 Self-ping successful"))
      .catch((err) => console.error("❌ Self-ping failed", err));
  }, 300000);
}
