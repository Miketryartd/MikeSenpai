import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const getCachedOrFetch = async <T,>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> => {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return cached as T;
    }
  } catch (error) {
    console.error(`Cache get failed for ${key}:`, error);
  }

  const data = await fetchFn();

  try {
    await redis.set(key, data, { ex: ttl });
  } catch (error) {
    console.error(`Cache set failed for ${key}:`, error);
  }

  return data;
};

export const invalidateCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache invalidation failed for ${key}:`, error);
  }
};