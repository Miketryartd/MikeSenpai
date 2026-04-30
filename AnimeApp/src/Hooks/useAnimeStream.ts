// frontend/src/Hooks/useAnimeStream.ts
import { useEffect, useState } from "react";
import { getMultiStreamLinks } from "../Services/multiStreamLink";
import type { AnimeStream } from "../Types/Interface";

export const useAnimeStream = (id: number | string | undefined) => {
  const [result, setResult] = useState<(AnimeStream & { source?: string }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMultiStreamLinks(id);

        if (isMounted && data) {
          setResult(data);
        } else if (isMounted) {
          setResult(null);
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