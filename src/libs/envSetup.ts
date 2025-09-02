import dotenv from "dotenv";
dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SELF_URL:", process.env.SELF_URL);

// Self-ping to keep the app awake on Render
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch(`${process.env.SELF_URL || "http://localhost:3000"}/`)
      .then(() => console.log("💚 Self-ping successful"))
      .catch((err) => console.error("❌ Self-ping failed", err));
  }, 300000);
}
