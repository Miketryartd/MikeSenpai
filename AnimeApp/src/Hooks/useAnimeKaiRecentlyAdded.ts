// frontend/src/Hooks/useAnimeKaiRecentlyAdded.ts
import { useState, useEffect } from "react";
import { fetchWithNgrok } from "../Utils/DynamicUrl";
import type { AnimeKaiNewReleasesResponse } from "../Types/AnimeKaiTypes";

export const useAnimeKaiRecentlyAdded = (page: number = 1) => {
  const [data, setData] = useState<AnimeKaiNewReleasesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentlyAdded = async () => {
      setLoading(true);
      try {
        const result = await fetchWithNgrok(`/mikesenpai/api/animekai/recently-added?page=${page}`);
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyAdded();
  }, [page]);

  return { data, loading, error };
};