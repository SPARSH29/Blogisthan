import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redisClient: ReturnType<typeof createClient> | undefined;
};

export const redis =
  globalForRedis.redisClient ??
  createClient({
    url: process.env.REDIS_URL,
  });

if (!globalForRedis.redisClient) {
  redis.connect().catch((err) => {
    console.error("Redis connection error:", err);
  });

  globalForRedis.redisClient = redis;
}

export default redis;