const redisClient = require("../config/redis");

const WINDOW_SIZE_IN_MINUTES = 1;
const MAX_WINDOW_REQUEST_COUNT = 30;

module.exports = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rateLimiter:${ip}`;
    console.log("⏳ Rate limiter active for:", key);

    const current = await redisClient.get(key);
    console.log("📊 Current request count:", current);

    if (current) {
      if (parseInt(current) >= MAX_WINDOW_REQUEST_COUNT) {
        return res.status(429).json({
          message: "Too many requests, please try again later.",
        });
      } else {
        await redisClient.incr(key);
      }
    } else {
      await redisClient.setEx(key, WINDOW_SIZE_IN_MINUTES * 60, "1");
    }

    next();
  } catch (error) {
    console.error("❌ Rate Limiter Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error in rate bhao",
      error: error.message,
    });
  }
};
