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

    const releases = await animekai.fetchNewReleases(page);
    
    if (!releases.results || releases.results.length === 0) {
      return res.status(404).json({ error: "No new releases found" });
    }

    const data = {
      currentPage: page,
      totalPages: releases.totalPages || 1,
      hasNextPage: releases.hasNextPage || false,
      results: releases.results.map((anime, index) => ({
        id: anime.id,
        title: getTitle(anime.title),
        japaneseTitle: typeof anime.title === 'object' ? anime.title?.native || "" : "",
        image: anime.image || "",
        cover: (anime as any).cover || anime.image || "",
        type: (anime as any).type || "TV",
        rating: (anime as any).rating || 0,
        releaseDate: (anime as any).releaseDate || "",
        description: (anime as any).description || "",
        genres: (anime as any).genres || [],
        subCount: (anime as any).sub || 0,
        dubCount: (anime as any).dub || 0,
        episodeCount: (anime as any).episodes || 0,
        url: anime.url || "",
      })),
    };

    cache.set(cacheKey, data);
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("AnimeKai New Releases error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getRecentlyUpdated = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const cacheKey = `animekai-recentlyupdated-${page}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const updated = await animekai.fetchRecentlyUpdated(page);
    
    if (!updated.results || updated.results.length === 0) {
      return res.status(404).json({ error: "No recently updated anime found" });
    }

    const data = {
      currentPage: page,
      totalPages: updated.totalPages || 1,
      hasNextPage: updated.hasNextPage || false,
      results: updated.results.map((anime) => ({
        id: anime.id,
        episodeId: (anime as any).episodeId || "",
        title: getTitle(anime.title),
        image: anime.image || "",
        episodeNumber: (anime as any).episodeNumber || 0,
        type: (anime as any).type || "TV",
        rating: (anime as any).rating || 0,
        url: anime.url || "",
      })),
    };

    cache.set(cacheKey, data);
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("AnimeKai Recently Updated error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getRecentlyAdded = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const cacheKey = `animekai-recentlyadded-${page}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const added = await animekai.fetchRecentlyAdded(page);
    
    if (!added.results || added.results.length === 0) {
      return res.status(404).json({ error: "No recently added anime found" });
    }

    const data = {
      currentPage: page,
      totalPages: added.totalPages || 1,
      hasNextPage: added.hasNextPage || false,
      results: added.results.map((anime) => ({
        id: anime.id,
        title: getTitle(anime.title),
        image: anime.image || "",
        cover: (anime as any).cover || anime.image || "",
        type: (anime as any).type || "TV",
        rating: (anime as any).rating || 0,
        releaseDate: (anime as any).releaseDate || "",
        description: (anime as any).description || "",
        genres: (anime as any).genres || [],
        url: anime.url || "",
      })),
    };

    cache.set(cacheKey, data);
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("AnimeKai Recently Added error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getLatestCompleted = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const completed = await animekai.fetchLatestCompleted(page);
    res.json({
      currentPage: page,
      totalPages: completed.totalPages || 1,
      hasNextPage: completed.hasNextPage || false,
      results: completed.results || []
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



const getStringParam = (param: string | string[] | undefined): string => {
  if (!param) return "";
  if (Array.isArray(param)) return param[0];
  return param;
};


export const getAnimeInfoWithRecommendations = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "No ID provided" });
    }
    
    const info = await animekai.fetchAnimeInfo(id);
    
    let recommendations = [];
    if ((info as any).recommendations && (info as any).recommendations.length) {
      recommendations = (info as any).recommendations;
    }
    
    res.json({
      success: true,
      id: info.id,
      title: info.title,
      recommendations: recommendations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};