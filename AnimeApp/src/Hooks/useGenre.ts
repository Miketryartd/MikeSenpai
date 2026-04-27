import { useEffect, useState } from "react";
import { getGenre } from "../Services/getGenre";
import type { AnimeGenre } from "../Types/Interface";
export const useGenre = (genre: string | null, page: number = 1) => {
  const [results, setResults] = useState<AnimeGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   
    if (!genre) return;

    const controller = new AbortController();

    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
    
        const data = await getGenre(genre, page);

        if (!data || !data.wholePage) {
          setError("No data returned");
          return;
        }

        setResults(data.wholePage ?? []);

      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError("Failed to load");
      } finally {
      
        setLoading(false);
      }
    };

    fetch();
    return () => controller.abort();

  }, [genre, page]); 

  return { results, loading, error };
};