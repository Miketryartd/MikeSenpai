// frontend/src/Hooks/useAnimeKaiNewReleases.ts
import { useState, useEffect } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";
import type { AnimeKaiNewReleasesResponse } from "../Types/AnimeKaiTypes";

export const useAnimeKaiNewReleases = (page: number = 1) => {
  const [data, setData] = useState<AnimeKaiNewReleasesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${DynamicUrl()}/mikesenpai/api/animekai/new-releases?page=${page}`);
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

    fetchNewReleases();
  }, [page]);

  return { data, loading, error };
};