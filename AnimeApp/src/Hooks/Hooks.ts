import { useEffect, useState } from "react";
import { getAnimeInfo } from "../Services/API";
import type { AnimeInfo } from "../Types/Interface";

export function useAnimeInfo(id: string) {
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const data = await getAnimeInfo(id);
  
        if (isMounted) setAnime(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Something went wrong");
        }
    
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { anime, loading, error };
}