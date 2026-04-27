import { useState, useEffect } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";
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
        const res = await fetch(`${DynamicUrl()}/mikesenpai/api/topRated/${page}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        setResults(data.AniData);
        setLoading(false);

      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError("Failed to load");
        setLoading(false);
      }
    };

    fetchTopRated();
    return () => controller.abort();
  }, [page]);


  return { results, loading, error, totalPages: TOTAL_PAGES };
}