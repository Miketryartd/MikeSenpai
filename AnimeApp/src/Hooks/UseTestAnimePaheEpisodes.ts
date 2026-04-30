// frontend/src/Hooks/useTestAnimePaheEpisodes.ts
import { useState } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";

interface SearchResult {
  id: string;
  title: string;
  image: string;
  type: string;
  rating: number;
}

interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
}

interface AnimeInfo {
  id: string;
  title: string;
  image: string;
  cover: string;
  description: string;
  genres: string[];
  totalEpisodes: number;
  episodes: Episode[];
}

export const useTestAnimePaheEpisodes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAnime = async (query: string): Promise<SearchResult[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/animepahe/search/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        return data.results;
      }
      throw new Error(data.error || "Search failed");
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAnimeInfo = async (animeId: string): Promise<AnimeInfo | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/animepahe/info/${animeId}`);
      const data = await res.json();
      if (data.success) {
        return data;
      }
      throw new Error(data.error || "Failed to fetch anime info");
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEpisodeSource = async (episodeId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/animepahe/episode-source/${encodeURIComponent(episodeId)}`);
      const data = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const playEpisode = (episodeId: string): void => {
    window.open(`${DynamicUrl()}/mikesenpai/api/test/animepahe/play/${encodeURIComponent(episodeId)}`, '_blank');
  };

  return {
    loading,
    error,
    searchAnime,
    getAnimeInfo,
    getEpisodeSource,
    playEpisode
  };
};