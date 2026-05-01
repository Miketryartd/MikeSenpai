// frontend/src/Hooks/useFeaturedAnime.ts
import { useState, useCallback, useRef } from "react";
import type { AnimeDetailProps } from "../Types/Interface";
import { fetchWithNgrok } from "../Utils/DynamicUrl";

interface AnimeKaiResult {
  id: string;
  title: string;
  image: string;
  cover: string;
  rating: number;
  type: string;
  releaseDate: string;
  description: string;
  genres: string[];
  status?: string;
  totalEpisodes?: number;
}

const PAGE_SIZE = 20;

export const useFeaturedAnime = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [animeList, setAnimeList] = useState<AnimeDetailProps[]>([]);
  
  const loadedPages = useRef<Set<number>>(new Set());
  const maxPages = 50;
  const isLoadingRef = useRef(false);

  const fetchRandomPage = useCallback(async (): Promise<AnimeDetailProps[]> => {
    let availablePages: number[] = [];
    for (let i = 1; i <= maxPages; i++) {
      if (!loadedPages.current.has(i)) {
        availablePages.push(i);
      }
    }
    
    if (availablePages.length === 0) {
      return [];
    }
    
    const randomIndex = Math.floor(Math.random() * availablePages.length);
    const randomPage = availablePages[randomIndex];
    
    loadedPages.current.add(randomPage);
    
    try {
      const data = await fetchWithNgrok(`/mikesenpai/api/animekai/top-rated?page=${randomPage}`);
      
      if (!data.results || data.results.length === 0) {
        return [];
      }
      
      return data.results.map((anime: AnimeKaiResult) => ({
        _id: anime.id,
        Name: anime.title,
        ImagePath: anime.image,
        Cover: anime.cover,
        DescripTion: anime.description,
        Genres: anime.genres || [],
        epCount: anime.totalEpisodes || 0,
        Status: anime.status || "Unknown",
        Duration: anime.type || "Unknown",
        MALScore: anime.rating?.toString() || "N/A",
        Studios: "Unknown",
        Producers: "Unknown",
        Premiered: anime.releaseDate || "Unknown",
        Aired: anime.releaseDate || "Unknown",
        Synonyms: "",
        RatingsNum: 0
      }));
    } catch (err) {
      console.error("Failed to fetch random page:", err);
      return [];
    }
  }, []);

  const initFetch = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    loadedPages.current.clear();
    setAnimeList([]);
    setHasMore(true);
    
    try {
      const results = await fetchRandomPage();
      
      if (results.length === 0) {
        setHasMore(false);
        setAnimeList([]);
      } else {
        setAnimeList(results);
        setHasMore(loadedPages.current.size < maxPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load featured anime");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchRandomPage]);

  const fetchMore = useCallback(async () => {
    if (isFetchingMore || !hasMore || isLoadingRef.current) return;
    
    setIsFetchingMore(true);
    isLoadingRef.current = true;
    
    try {
      const newResults = await fetchRandomPage();
      
      if (newResults.length === 0 || loadedPages.current.size >= maxPages) {
        setHasMore(false);
      } else {
        setAnimeList(prev => {
          const existingIds = new Set(prev.map(a => String(a._id)));
          const uniqueNew = newResults.filter(a => !existingIds.has(String(a._id)));
          return [...prev, ...uniqueNew];
        });
        setHasMore(loadedPages.current.size < maxPages);
      }
    } catch (err) {
      console.error("Failed to fetch more:", err);
    } finally {
      setIsFetchingMore(false);
      isLoadingRef.current = false;
    }
  }, [isFetchingMore, hasMore, fetchRandomPage]);

  return {
    animeList,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    initFetch,
    fetchMore,
    PAGE_SIZE,
  };
};