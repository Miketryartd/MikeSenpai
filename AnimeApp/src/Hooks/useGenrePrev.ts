
import { useEffect, useState } from "react";
import { getGenre } from "../Services/getGenre";
import { GENRES } from "../Config/genres";

export const useGenrePreviews = () => {
  const [previews, setPreviews] = useState<Record<string, string>>({});


  useEffect(() => {
    const fetchPreviews = async () => {
    
      const entries = await Promise.all(
        GENRES.map(async (genre) => {
          try {
            const data = await getGenre(genre, 1);
            const firstAnime = data?.wholePage?.[0];
            return [genre, firstAnime?.ImagePath ?? ""] as [string, string];
          } catch {
            return [genre, ""] as [string, string]; 
          }
        })
      );

    
      setPreviews(Object.fromEntries(entries));
    };

    fetchPreviews();
  }, []); 

  return { previews };
};