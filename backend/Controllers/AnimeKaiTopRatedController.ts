// backend/Controllers/AnimeKaiTopRatedController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";

const animekai = new ANIME.AnimeKai();
const cache = createCache<any>();

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
};

export const getTopRated = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const cacheKey = `animekai-toprated-${page}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    // Try different methods since fetchNewReleases might be broken
    let results = null;
    
    try {
      // Method 1: Try search with empty string to get all
      const searchResults = await animekai.search("", page);
      if (searchResults.results && searchResults.results.length > 0) {
        results = searchResults;
      }
    } catch (err) {
      console.log("AnimeKai search failed:", err);
    }

    if (!results) {
      try {
        // Method 2: Try fetchRecentlyAdded
        const recentResults = await animekai.fetchRecentlyAdded(page);
        if (recentResults.results && recentResults.results.length > 0) {
          results = recentResults;
        }
      } catch (err) {
        console.log("AnimeKai fetchRecentlyAdded failed:", err);
      }
    }

    if (!results || !results.results || results.results.length === 0) {
      return res.status(404).json({ error: "No results found from AnimeKai" });
    }

    const sortedByRating = [...results.results].sort((a, b) => {
      const ratingA = (a as any).rating || 0;
      const ratingB = (b as any).rating || 0;
      return ratingB - ratingA;
    });

    const data = {
      currentPage: page,
      totalPages: results.totalPages || 10,
      hasNextPage: results.hasNextPage || page < 10,
      results: sortedByRating.map((anime, index) => ({
        id: anime.id,
        title: getTitle(anime.title),
        image: anime.image || "",
        cover: (anime as any).cover || anime.image || "",
        rating: (anime as any).rating || 0,
        type: (anime as any).type || "TV",
        releaseDate: (anime as any).releaseDate || "",
        description: (anime as any).description || "",
      })),
    };

    cache.set(cacheKey, data);
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("AnimeKai Top Rated error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};