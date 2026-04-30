
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";
import { normalizeAnimeUnityData, normalizeAnimeKaiData } from "../Utilities/animeTransformer.js";

const animeunity = new ANIME.AnimeUnity();
const animesaturn = new ANIME.AnimeSaturn();
const hianime = new ANIME.Hianime();
const animekai = new ANIME.AnimeKai();

const cache = createCache<any>();

const getStringParam = (param: any): string => {
  if (!param) return "";
  if (Array.isArray(param)) return param[0];
  if (typeof param === 'string') return param;
  return "";
};

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
};

export const unifiedSearch = async (req: Request, res: Response) => {
  try {
    const query = getStringParam(req.params.query);
    if (!query) {
      return res.status(400).json({ error: "Missing search query" });
    }

    let data = null;
    let source = "animeunity";

    try {
      const results = await animeunity.search(query);
      if (results.results && results.results.length > 0) {
        data = {
          results: results.results.map((anime: any) => ({
            Id: anime.id,
            Name: getTitle(anime.title),
            Image: anime.image || "",
            finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            source: "animeunity"
          })),
          source: "animeunity"
        };
      }
    } catch (err) {
      console.log("AnimeUnity search failed:", err);
    }

    if (!data) {
      try {
        const results = await animesaturn.search(query);
        if (results.results && results.results.length > 0) {
          data = {
            results: results.results.map((anime: any) => ({
              Id: anime.id,
              Name: getTitle(anime.title),
              Image: anime.image || "",
              finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              source: "animesaturn"
            })),
            source: "animesaturn"
          };
        }
      } catch (err) {
        console.log("AnimeSaturn search failed:", err);
      }
    }

    if (!data) {
      try {
        const results = await hianime.search(query);
        if (results.results && results.results.length > 0) {
          data = {
            results: results.results.map((anime: any) => ({
              Id: anime.id,
              Name: getTitle(anime.title),
              Image: anime.image || "",
              finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              source: "hianime"
            })),
            source: "hianime"
          };
        }
      } catch (err) {
        console.log("HiAnime search failed:", err);
      }
    }

    if (!data) {
      try {
        const results = await animekai.search(query);
        if (results.results && results.results.length > 0) {
          data = {
            results: results.results.map((anime: any) => ({
              Id: anime.id,
              Name: getTitle(anime.title),
              Image: anime.image || "",
              finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              source: "animekai"
            })),
            source: "animekai"
          };
        }
      } catch (err) {
        console.log("AnimeKai search failed:", err);
      }
    }

    if (!data) {
      return res.status(200).json({ results: [], source: "none" });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Unified search error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const unifiedDetails = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const key = `unified-detail-${id}`;
    const cached = cache.get(key);
    if (cached) {
      return res.status(200).json(cached);
    }

    let data = null;
    let source = "animeunity";

    try {
      const info = await animeunity.fetchAnimeInfo(id);
      if (info && info.id) {
        data = {
          local: {
            _id: info.id,
            Name: getTitle(info.title),
            ImagePath: info.image || "",
            Cover: info.cover || info.image || "",
            DescripTion: info.description || "",
            Genres: info.genres || [],
            epCount: info.totalEpisodes || info.episodes?.length || 0,
            Status: info.status || "Unknown",
            Duration: info.type || "Unknown",
            MALScore: info.rating?.toString() || "N/A",
            Studios: (info as any).studios?.join(", ") || "Unknown",
            Producers: (info as any).producers?.join(", ") || "Unknown",
            Premiered: (info as any).releaseDate || "Unknown"
          },
          source: "animeunity"
        };
      }
    } catch (err) {
      console.log("AnimeUnity details failed:", err);
    }

    if (!data) {
      try {
        const info = await animesaturn.fetchAnimeInfo(id);
        if (info && info.id) {
          data = {
            local: {
              _id: info.id,
              Name: getTitle(info.title),
              ImagePath: info.image || "",
              Cover: info.cover || info.image || "",
              DescripTion: info.description || "",
              Genres: info.genres || [],
              epCount: info.totalEpisodes || info.episodes?.length || 0,
              Status: info.status || "Unknown",
              Duration: info.type || "Unknown",
              MALScore: info.rating?.toString() || "N/A"
            },
            source: "animesaturn"
          };
        }
      } catch (err) {
        console.log("AnimeSaturn details failed:", err);
      }
    }

    if (!data) {
      try {
        const info = await hianime.fetchAnimeInfo(id);
        if (info && info.id) {
          data = {
            local: {
              _id: info.id,
              Name: getTitle(info.title),
              ImagePath: info.image || "",
              Cover: info.cover || info.image || "",
              DescripTion: info.description || "",
              Genres: info.genres || [],
              epCount: info.totalEpisodes || info.episodes?.length || 0,
              Status: info.status || "Unknown",
              Duration: info.type || "Unknown",
              MALScore: info.rating?.toString() || "N/A"
            },
            source: "hianime"
          };
        }
      } catch (err) {
        console.log("HiAnime details failed:", err);
      }
    }

    if (!data) {
      return res.status(404).json({ error: "No anime found" });
    }

    cache.set(key, data);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Unified details error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const unifiedInfo = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const key = `unified-info-${id}`;
    const cached = cache.get(key);
    if (cached) {
      return res.status(200).json(cached);
    }

    let data = null;

    try {
      const info = await animeunity.fetchAnimeInfo(id);
      if (info && info.id) {
        const normalized = normalizeAnimeUnityData(info);
        data = normalized;
      }
    } catch (err) {
      console.log("AnimeUnity info failed:", err);
    }

    if (!data) {
      try {
        const animekai = new ANIME.AnimeKai();
        const info = await animekai.fetchAnimeInfo(id);
        if (info && info.id) {
          const normalized = normalizeAnimeKaiData(info);
          data = normalized;
        }
      } catch (err) {
        console.log("AnimeKai info failed:", err);
      }
    }

    if (!data) {
      try {
        const info = await animesaturn.fetchAnimeInfo(id);
        if (info && info.id) {
          const normalized = normalizeAnimeKaiData(info);
          data = normalized;
        }
      } catch (err) {
        console.log("AnimeSaturn info failed:", err);
      }
    }

    if (!data) {
      return res.status(404).json({ error: "No anime found" });
    }

    cache.set(key, data);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Unified info error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};