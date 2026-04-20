
import { useState } from "react";
import { searchAnime } from "../Services/searchAnime";
import type { AnimeSearch } from "../Types/Interface";
export function useSearchAnime() {
  const [results, setResults] = useState<AnimeSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchAnime(query);

      if (data.found === false) {
        setResults([]);
        return;
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}