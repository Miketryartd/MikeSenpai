// backend/Controllers/AnimeKaiTopRatedController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";

const animekai = new ANIME.AnimeKai();
const cache = createCache<any>();

const getStringParam = (param: string | string[] | undefined): string => {
  if (!param) return "";
  if (Array.isArray(param)) return param[0];
  return param;
};

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

    const searchResults = await animekai.search("", page);
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const sortedByRating = [...searchResults.results].sort((a, b) => {
      const ratingA = (a as any).rating || 0;
      const ratingB = (b as any).rating || 0;
      return ratingB - ratingA;
    });

    const data = {
      currentPage: page,
      totalPages: searchResults.totalPages || 1,
      hasNextPage: searchResults.hasNextPage || false,
      results: sortedByRating.map((anime, index) => ({
        rank: index + 1,
        id: anime.id,
        title: getTitle(anime.title),
        image: anime.image || "",
        cover: (anime as any).cover || anime.image || "",
        rating: (anime as any).rating || 0,
        type: (anime as any).type || "TV",
        releaseDate: (anime as any).releaseDate || "",
        description: (anime as any).description || "",
        genres: (anime as any).genres || [],
        status: (anime as any).status || "",
        totalEpisodes: (anime as any).totalEpisodes || 0,
        url: anime.url || "",
      })),
    };

    cache.set(cacheKey, data);
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("AnimeKai Top Rated error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getTopRatedByType = async (req: Request, res: Response) => {
  try {
    const type = getStringParam(req.params.type);
    const page = req.query.page ? Number(req.query.page) : 1;
    
    if (!type) {
      return res.status(400).json({ error: "Type parameter required" });
    }

    const cacheKey = `animekai-toprated-${type}-${page}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let results;
    switch(type.toLowerCase()) {
      case "movie":
        results = await animekai.fetchMovie(page);
        break;
      case "tv":
        results = await animekai.fetchTV(page);
        break;
      case "ova":
        results = await animekai.fetchOVA(page);
        break;
      case "ona":
        results = await animekai.fetchONA(page);
        break;
      case "special":
        results = await animekai.fetchSpecial(page);
        break;
      default:
        results = await animekai.search("", page);
    }

    if (!results.results || results.results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const sortedByRating = [...results.results].sort((a, b) => {
      const ratingA = (a as any).rating || 0;
      const ratingB = (b as any).rating || 0;
      return ratingB - ratingA;
    });

    const data = {
      currentPage: page,
      type: type,
      totalPages: results.totalPages || 1,
      hasNextPage: results.hasNextPage || false,
      results: sortedByRating.map((anime, index) => ({
        rank: index + 1,
        id: anime.id,
        title: getTitle(anime.title),
        image: anime.image || "",
        cover: (anime as any).cover || anime.image || "",
        rating: (anime as any).rating || 0,
        type: (anime as any).type || type,
        releaseDate: (anime as any).releaseDate || "",
        description: (anime as any).description || "",
        genres: (anime as any).genres || [],
      })),
    };

    cache.set(cacheKey, data);
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("AnimeKai Top Rated by type error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};