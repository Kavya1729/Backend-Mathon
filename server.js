require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const getRedisClient = require("./config/redis");
const chapterRoutes = require("./routes/chapterRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the Chapter Performance Dashboard");
});

app.use("/api/v1/chapter", chapterRoutes);

(async () => {
  try {
    const redisClient = await getRedisClient();

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Visit: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server due to Redis error:", error);
    process.exit(1);
  }
})();
