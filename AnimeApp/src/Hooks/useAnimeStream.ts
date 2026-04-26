import { useEffect, useState } from "react";
import { getStreamLinks } from "../Services/streamLink";
import type { AnimeStream } from "../Types/Interface";

export const useAnimeStream = (id: number | string) => {
  const [result, setResult] = useState<AnimeStream | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getStreamLinks(id);

        if (isMounted) {
          setResult(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { result, loading, error };
};