import { useEffect, useState } from "react";
import { getAllAnime } from "../Services/getAllAnime";

export function useAnimeAll() {
  const [anime, setAnime] = useState<number>(Number);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: number = await getAllAnime(); 
        console.log("API RES", data);
        setAnime(data);
      } catch (err: unknown) {
        console.error("Error fetching all anime", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { anime, loading, error };
}