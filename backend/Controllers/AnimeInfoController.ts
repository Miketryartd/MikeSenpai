import { Request, Response } from "express";
import { createCache } from "../Utilities/cache.js";
import { AnimeInfo } from "../Type/Interface.js";
import { ANIME } from "@consumet/extensions";

const cache = createCache<AnimeInfo>();
const animeunity = new ANIME.AnimeUnity();

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://anipub.xyz/',
  'Origin': 'https://anipub.xyz'
};

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
};

export const getAnimeInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ error: "Missing id" });

    const key = `animeInfo-${id}`;
    const cached = cache.get(key);
    if (cached) {
      console.log("Cache hit:", key);
      return res.status(200).json(cached);
    }

    let data = null;
    let source = "animeunity";

    try {
      const info = await animeunity.fetchAnimeInfo(String(id));
      if (info && info.id) {
        data = {
          _id: info.id,
          Name: getTitle(info.title),
          ImagePath: info.image || "",
          Cover: info.cover || info.image || "",
          Synonyms: "",
          Aired: new Date(),
          Premiered: new Date(),
          RatingsNum: info.rating || 0,
          Genres: info.genres || [],
          Studios: "",
          Description: info.description || "",
          Duration: info.type || "",
          MALScore: info.rating?.toString() || "N/A",
          Status: info.status || "",
          epCount: info.totalEpisodes || 0
        };
        console.log(`AnimeUnity info success for ID: ${id}`);
      }
    } catch (err) {
      console.log(`AnimeUnity info error for ID: ${id}`, err);
    }

    if (!data) {
      console.log(`Falling back to Anipub for anime info: ${id}`);
      source = "anipub";
      try {
        const resp = await fetch(`https://anipub.xyz/api/info/${id}`, { headers });
        if (resp.ok) {
          data = await resp.json();
          console.log(`Anipub info success for ID: ${id}`);
        }
      } catch (err) {
        console.log(`Anipub info error for ID: ${id}`, err);
      }
    }

    if (!data) {
      return res.status(200).json(null);
    }

    cache.set(key, data);
    console.log("Cached:", key);
    return res.status(200).json(data);

  } catch (err) {
    console.error("Server error", err);
    return res.status(500).json({ error: "internal error" });
  }
};