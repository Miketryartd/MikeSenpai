// frontend/src/Hooks/useAnimeKaiTopRated.ts
import { useState, useEffect } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";
import type { AnimeKaiTopRatedResponse } from "../Types/AnimeKaiTypes";

export const useAnimeKaiTopRated = (page: number = 1) => {
  const [data, setData] = useState<AnimeKaiTopRatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${DynamicUrl()}/mikesenpai/api/animekai/top-rated?page=${page}`);
        const result = await response.json();
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

    fetchTopRated();
  }, [page]);

  return { data, loading, error };
};