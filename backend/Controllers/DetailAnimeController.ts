// backend/Controllers/DetailAnimeController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";

const animekai = new ANIME.AnimeKai();
const cache = createCache<any>();

// Helper to detect if ID is numeric (Anipub) or string slug (AnimeKai)
const isNumericId = (id: string): boolean => {
  return /^\d+$/.test(id);
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const key = `detail-${id}`;
    const cached = cache.get(key);
    if (cached) {
      return res.status(200).json(cached);
    }

    let data = null;
    let source = "unknown";

    // Check if ID is numeric (Anipub) or string (AnimeKai)
    if (isNumericId(id)) {
      // Try Anipub first for numeric IDs
      console.log(`📺 Fetching from Anipub for numeric ID: ${id}`);
      const url = `https://anipub.xyz/anime/api/details/${id}`;
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          data = await response.json();
          source = "anipub";
          console.log(`✅ Anipub success for ID: ${id}`);
        } else if (response.status === 404) {
          console.log(`Anipub 404 for ID: ${id}, trying AnimeKai...`);
        }
      } catch (err) {
        console.log(`Anipub error for ID: ${id}`, err);
      }
    }

    // If Anipub failed or ID is not numeric, try AnimeKai
    if (!data) {
      console.log(`🎬 Trying AnimeKai for ID: ${id}`);
      try {
        const animeKaiInfo = await animekai.fetchAnimeInfo(id);
        if (animeKaiInfo && animeKaiInfo.id) {
          // Transform AnimeKai data to match your frontend format
          const title = typeof animeKaiInfo.title === 'string' 
            ? animeKaiInfo.title 
            : animeKaiInfo.title?.english || animeKaiInfo.title?.romaji || "Unknown";
          
          data = {
            local: {
              _id: animeKaiInfo.id,
              Name: title,
              ImagePath: animeKaiInfo.image || "",
              Cover: (animeKaiInfo as any).cover || animeKaiInfo.image || "",
              DescripTion: animeKaiInfo.description || "",
              Genres: animeKaiInfo.genres || [],
              epCount: animeKaiInfo.totalEpisodes || animeKaiInfo.episodes?.length || 0,
              Status: animeKaiInfo.status || "Unknown",
              Duration: animeKaiInfo.type || "Unknown",
              MALScore: animeKaiInfo.rating?.toString() || "N/A",
              Studios: (animeKaiInfo as any).studios?.join(", ") || "Unknown",
              Producers: (animeKaiInfo as any).producers?.join(", ") || "Unknown",
              Premiered: (animeKaiInfo as any).releaseDate || "Unknown",
              Aired: (animeKaiInfo as any).releaseDate || "Unknown",
              Synonyms: (animeKaiInfo as any).synonyms?.join(", ") || "",
            }
          };
          source = "animekai";
          console.log(`✅ AnimeKai success for ID: ${id}`);
        }
      } catch (animeKaiErr) {
        console.log(`❌ AnimeKai failed for ID: ${id}`, animeKaiErr);
      }
    }

    // Final fallback: Try Anipub with search if all else fails
    if (!data) {
      console.log(`🔄 Final fallback: Searching Anipub for "${id}"`);
      try {
        const searchUrl = `https://anipub.xyz/api/search/${encodeURIComponent(id)}`;
        const searchResponse = await fetch(searchUrl);
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.results && searchData.results.length > 0) {
            const firstResult = searchData.results[0];
            const detailUrl = `https://anipub.xyz/anime/api/details/${firstResult.Id || firstResult._id}`;
            const detailResponse = await fetch(detailUrl);
            if (detailResponse.ok) {
              data = await detailResponse.json();
              source = "anipub-search";
              console.log(`✅ Found via search fallback`);
            }
          }
        }
      } catch (fallbackErr) {
        console.log("Fallback search failed:", fallbackErr);
      }
    }

    if (!data) {
      return res.status(404).json({ error: `No data found for ID: ${id}` });
    }

    // Add source metadata to response
    if (data.local) {
      data.source = source;
    }

    cache.set(key, data);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error fetching details:", error);
    return res.status(500).json({ error: "server error" });
  }
};