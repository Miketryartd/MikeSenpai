

import { useState, useEffect } from "react";
import { fetchSpotlight } from "../Services/getSpotlight";

export const useSpotlight = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchSpotlight();
        setResults(data.results ?? []);
      } catch {
        setError("Failed to load spotlight");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { results, loading, error };
};