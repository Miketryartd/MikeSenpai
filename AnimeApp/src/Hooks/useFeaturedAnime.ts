import { useEffect, useState } from "react";
import type { AnimeDetailProps } from "../Types/Interface";
import { getInfo } from "../Services/getInfo";

const FETCH_COUNT = 50;   
const TOTAL_IN_DB = 150;  


const getRandomIds = (total: number, count: number): number[] => {
  const allIds = Array.from({ length: total }, (_, i) => i + 1);
 


  for (let i = allIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allIds[i], allIds[j]] = [allIds[j], allIds[i]]; 
  }

  
  return allIds.slice(0, count);
};

export const useFeaturedAnime = () => {

  const [animeList, setAnimeList] = useState<AnimeDetailProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchFeatured = async () => {
      try {
        setIsLoading(true);

 
        const randomIds = getRandomIds(TOTAL_IN_DB, FETCH_COUNT);

        const results = await Promise.all(
          randomIds.map((id) => getInfo(id).catch(() => null))
        );

        const cleaned = results
          .filter((anime): anime is AnimeDetailProps => anime !== null)
         
          .filter((anime) => anime.ImagePath && anime.ImagePath.trim() !== "");

        setAnimeList(cleaned);

      } catch (err) {
        setError("Failed to load anime.");
        console.error("useFeaturedAnime error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();

  }, []);

  return { animeList, isLoading, error };
};