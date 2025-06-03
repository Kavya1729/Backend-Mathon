const getRedisClient = require("../config/redis");

module.exports = async (req, res, next) => {
  const key = `chapters_cache:${JSON.stringify(req.query)}`;

  try {
    const redisClient = await getRedisClient();

    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log("🔁 Cache hit:", key);
      return res.status(200).json(JSON.parse(cachedData));
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisClient.setEx(key, 3600, JSON.stringify(body)); 
      originalJson(body);
    };

    next();
  } catch (error) {
    console.error("❌ Cache Middleware Error:", error);
    next(); 
  }
};
