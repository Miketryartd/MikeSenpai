
import { useState, useCallback } from "react";
import { searchAnime } from "../Services/searchAnime";
import type { AnimeSearch } from "../Types/Interface";

export function useSearchAnime() {
  const [results, setResults] = useState<AnimeSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    
    if (!query || query.trim().length === 0) {
      setResults([]);
      setSearchMessage(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSearchMessage(null);

    try {
      const data = await searchAnime(query);
      

      if (data.message) {
        setSearchMessage(data.message);
        setResults([]);
        return;
      }

   
      let searchResults = [];
      if (data.results) {
        searchResults = data.results;
      } else if (data.found === false || data.results?.length === 0) {
        setSearchMessage(`No results found for "${query}". Try different keywords.`);
        setResults([]);
        return;
      } else if (Array.isArray(data)) {
        searchResults = data;
      } else {
        searchResults = [];
      }

    
      if (searchResults.length > 0) {
        const resultsWithSource = searchResults.map((result: any) => ({
    ...result,
    source: data.source || "anipub"
  }));
        setResults(resultsWithSource);
        setSearchMessage(null);
      } else {
        setResults([]);
        setSearchMessage(`No results found for "${query}". Try different keywords.`);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search, searchMessage };
}