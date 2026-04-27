export const createCache = <T>() => {
  const cache = new Map<string, { data: T; timestamp: number }>();
  const TTL = 10 * 60 * 1000; // 10 minutes

  return {
    get(key: string): T | null {
      const entry = cache.get(key);
      if (!entry) return null;                          // nothing saved
      if (Date.now() - entry.timestamp > TTL) {         // expired?
        cache.delete(key);                              // throw it out
        return null;
      }
      return entry.data;                                // fresh, return it
    },

    set(key: string, data: T): void {
      cache.set(key, { data, timestamp: Date.now() });
    }
  };
};