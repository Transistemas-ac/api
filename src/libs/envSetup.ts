import dotenv from "dotenv";

// Self-ping mechanism to keep the app alive on Render
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch(`http://localhost:${process.env.PORT || 3000}/health`)
      .then(() => console.log("💚 Self-ping successful"))
      .catch((err) => console.error("❌ Self-ping failed", err));
  }, 20000); // every 20 seconds
}
// Load environment variables from .env file in development environment
else {
  dotenv.config();
}
