// backend/Utilities/redisCache.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const getCachedOrFetch = async (key: string, fetchFn: () => Promise<any>) => {
  const cached = await redis.get(key);
  if (cached) return cached;
  
  const data = await fetchFn();
  await redis.set(key, data, { ex: 3600 }); // Cache for 1 hour
  return data;
};