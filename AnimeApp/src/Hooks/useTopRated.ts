import { useEffect, useState } from "react";
import type { AniData } from "../Types/Interface";
import { getTopRated } from "../Services/topRated";

export function useTopRated() {
  const [results, setResults] = useState<AniData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchApi = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTopRated();
        if (isMounted) {
          setResults(data.AniData);
        }
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

    fetchApi();

    return () => {
      isMounted = false;
    };
  }, []);

  return { results, loading, error };
}