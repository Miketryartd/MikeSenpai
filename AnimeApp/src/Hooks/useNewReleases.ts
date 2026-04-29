import { useState, useEffect } from "react";
import { fetchNewReleases } from "../Services/fetchNewReleases";

interface NewReleaseAnime {
  id: string;
  title: string;
  japaneseTitle: string;
  image: string;
  url: string;
  type: string;
  sub: number;
  dub: number;
  episodes: number;
}

export const useNewReleases = (page: number = 1) => {
  const [results, setResults]         = useState<NewReleaseAnime[]>([]);
  const [loading, setLoading]         = useState<boolean>(true);
  const [error, setError]             = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [totalPages, setTotalPages]   = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNewReleases(page);
        setResults(data.results);
        setHasNextPage(data.hasNextPage);
        setTotalPages(data.totalPages);
      } catch {
        setError("Failed to load new releases");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]); 

  return { results, loading, error, hasNextPage, totalPages };
};