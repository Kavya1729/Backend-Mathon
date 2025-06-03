const getRedisClient = require("../config/redis");

const WINDOW_SIZE_IN_MINUTES = 1;
const MAX_WINDOW_REQUEST_COUNT = 30;

module.exports = async (req, res, next) => {
  try {
    const redisClient = await getRedisClient();

    const ip = req.ip;
    const key = `rateLimiter:${ip}`;

    const current = await redisClient.get(key);
    if (current) {
      if (parseInt(current) > MAX_WINDOW_REQUEST_COUNT) {
        return res
          .status(429)
          .json({ message: "Too many requests, please try again later." });
      } else {
        await redisClient.incr(key);
      }
    } else {
      await redisClient.setEx(key, WINDOW_SIZE_IN_MINUTES * 60, "1");
    }

    next();
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    res.status(500).json({ message: "Internal Server Error in rate limiter" });
  }
};
