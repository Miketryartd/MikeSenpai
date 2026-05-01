// frontend/src/Hooks/useAnimeKaiLatestCompleted.ts
import { useState, useEffect } from "react";
import { fetchWithNgrok } from "../Utils/DynamicUrl";
import type { AnimeKaiNewReleasesResponse } from "../Types/AnimeKaiTypes";

export const useAnimeKaiLatestCompleted = (page: number = 1) => {
  const [data, setData] = useState<AnimeKaiNewReleasesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestCompleted = async () => {
      setLoading(true);
      try {
        const result = await fetchWithNgrok(`/mikesenpai/api/animekai/latest-completed?page=${page}`);
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

    fetchLatestCompleted();
  }, [page]);

  return { data, loading, error };
};