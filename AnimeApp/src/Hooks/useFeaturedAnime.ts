import { useState, useCallback, useRef } from "react";
import type { AnimeDetailProps } from "../Types/Interface";
import { getInfo } from "../Services/getInfo";

const BATCH_SIZE = 30;       
const CONCURRENCY = 5;        
const ITEMS_PER_PAGE = 15;    
const TOTAL_IN_DB = 8324;     


const getUnusedRandomIds = (usedIds: Set<number>, count: number): number[] => {

  const pool: number[] = [];
  for (let i = 1; i <= TOTAL_IN_DB; i++) {
    if (!usedIds.has(i)) pool.push(i);
  }


  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
};


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithConcurrency = async (
  ids: number[],
  concurrency: number,
  delayMs: number = 300  
): Promise<(AnimeDetailProps | null)[]> => {
  const results: (AnimeDetailProps | null)[] = [];

  for (let i = 0; i < ids.length; i += concurrency) {
    const chunk = ids.slice(i, i + concurrency);

    const chunkResults = await Promise.all(
      chunk.map((id) => getInfo(id).catch(() => null))
    );

    results.push(...chunkResults);


    if (i + concurrency < ids.length) {
      await sleep(delayMs); 
    }
  }

  return results;
};

export const useFeaturedAnime = () => {
  const [isLoading, setIsLoading]             = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore]   = useState<boolean>(false);
  const [error, setError]                     = useState<string | null>(null);
  const [hasMore, setHasMore]                 = useState<boolean>(true);
  const CACHE_KEY = "featuredAnime";

  const [animeList, setAnimeList] = useState<AnimeDetailProps[]>(() => {
  const cached = sessionStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
});


  const usedIdsRef = useRef<Set<number>>(new Set());

 


  const fetchBatch = useCallback(async (isFirstLoad: boolean) => {
  
    if (isFetchingMore || isLoading) return;

  
    if (usedIdsRef.current.size >= TOTAL_IN_DB) {
      setHasMore(false);
      return;
    }


    isFirstLoad ? setIsLoading(true) : setIsFetchingMore(true);

    try {

      const newIds = getUnusedRandomIds(usedIdsRef.current, BATCH_SIZE);

      if (newIds.length === 0) {
        setHasMore(false);
        return;
      }

 
      newIds.forEach((id) => usedIdsRef.current.add(id));

  
      const raw = await fetchWithConcurrency(newIds, CONCURRENCY);

  
      const cleaned = raw.filter(
        (anime): anime is AnimeDetailProps =>
          anime !== null &&
          anime.ImagePath != null &&
          anime.ImagePath.trim() !== ""
      );

   
      setAnimeList((prev) => {
  const updated = [...prev, ...cleaned];
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  return updated;
});
      

   
      if (usedIdsRef.current.size >= TOTAL_IN_DB) {
        setHasMore(false);
      }

    } catch (err) {
    console.error("useFeaturedAnime error:", err);

  if (animeList.length === 0) {
    setError("Failed to load anime.");
  }
      console.error("useFeaturedAnime error:", err);
    } finally {
      isFirstLoad ? setIsLoading(false) : setIsFetchingMore(false);
    }
  }, [isFetchingMore, isLoading]);


  const initFetch = useCallback(() => {
    fetchBatch(true);
  }, [fetchBatch]);

  
  const fetchMore = useCallback(() => {
    fetchBatch(false);
  }, [fetchBatch]);

  return {
    animeList,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    initFetch,
    fetchMore,
    ITEMS_PER_PAGE,
  };
};