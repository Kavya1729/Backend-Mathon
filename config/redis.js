require("dotenv").config();
const { createClient } = require("redis");

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`🔁 Redis reconnect attempt ${retries}`);
          return Math.min(retries * 50, 2000);
        },
      },
    });

    redisClient.on("error", (err) =>
      console.error("❌ Redis Client Error", err)
    );

    try {
      await redisClient.connect();
      console.log("✅ Redis connected");
    } catch (err) {
      console.error("❌ Failed to connect to Redis:", err);
    }
  }

  return redisClient;
}

module.exports = getRedisClient;
