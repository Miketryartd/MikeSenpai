// frontend/src/Hooks/useAnimeKaiTopRated.ts
import { useState, useEffect } from "react";
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const useAnimeKaiTopRated = (page: number = 1) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      try {
        const result = await fetchWithNgrok(`/mikesenpai/api/animekai/top-rated?page=${page}`);
        if (result.error) {
          setError(result.error);
        } else {
          if (result.results) {
            result.results = result.results.map((anime: any) => ({
              ...anime,
              animeKaiId: anime.animeKaiId || anime.title
            }));
          }
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