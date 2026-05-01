// frontend/src/Hooks/useTopRated.ts
import { useState, useEffect } from "react";
import { fetchWithNgrok } from "../Utils/DynamicUrl";
import type { AniData } from "../Types/Interface";

const TOTAL_PAGES = 354; 

export function useTopRated(page: number = 1) {
  const [results, setResults] = useState<AniData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTopRated = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWithNgrok(`/mikesenpai/api/topRated/${page}`);
        setResults(data.AniData);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
    return () => controller.abort();
  }, [page]);

  return { results, loading, error, totalPages: TOTAL_PAGES };
}