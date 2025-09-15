import fetch from "cross-fetch";
import dotenv from "dotenv";
dotenv.config();

console.log("\nNODE_ENV:", process.env.NODE_ENV);
console.log("SELF_URL:", process.env.SELF_URL);
console.log("DB_URL:", process.env.DB_URL, "\n");

// Self-ping to keep the app awake on Render
if (process.env.NODE_ENV === "production") {
  console.log("🚀 Starting self-ping loop...");
  setInterval(() => {
    fetch(`${process.env.SELF_URL}`)
      .then(() => console.log("💚 Auto-ping exitoso"))
      .catch((err) => console.error("❌ Auto-ping fallido", err));
  }, 30000); // 30 seconds
}
