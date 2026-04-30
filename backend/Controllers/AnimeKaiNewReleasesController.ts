// backend/Controllers/AnimeKaiNewReleasesController.ts
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

export const getNewReleases = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const cacheKey = `animekai-newreleases-${page}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let releases = null;
    
    try {
      releases = await animekai.fetchNewReleases(page);
    } catch (err) {
      console.log("AnimeKai fetchNewReleases failed:", err);
    }

    if (!releases || !releases.results || releases.results.length === 0) {
      try {
        releases = await animekai.fetchRecentlyAdded(page);
      } catch (err) {
        console.log("AnimeKai fetchRecentlyAdded failed:", err);
      }
    }

    if (!releases || !releases.results || releases.results.length === 0) {
      return res.status(404).json({ error: "No new releases found" });
    }

    const data = {
      currentPage: page,
      totalPages: releases.totalPages || 10,
      hasNextPage: releases.hasNextPage || page < 10,
      results: releases.results.map((anime) => ({
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
    console.error("AnimeKai New Releases error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};