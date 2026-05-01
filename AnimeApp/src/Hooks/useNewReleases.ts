import { useState, useEffect } from "react";
import { fetchWithNgrok } from "../Utils/DynamicUrl";

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
  const [results, setResults] = useState<NewReleaseAnime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWithNgrok(`/mikesenpai/api/new-releases?page=${page}`);
        setResults(data.results || []);
        setHasNextPage(data.hasNextPage || false);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Failed to load new releases:", err);
        setError("Failed to load new releases");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]);

  return { results, loading, error, hasNextPage, totalPages };
};