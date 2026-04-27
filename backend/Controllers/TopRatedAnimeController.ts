import { Request, Response } from "express";
import { createCache } from "../Utilities/cache.js";
import { TopRatedAnimeP } from "../Type/Interface.js";


const cache = createCache<TopRatedAnimeP>();

export const TopRatedAnime = async (req: Request, res: Response) => {
  try {
    const page = req.params.page ? Number(req.params.page) : 1;

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

  
    const key = `topRated-${page}`;


    const cached = cache.get(key);
    if (cached) {
      console.log("Cache hit:", key);
      return res.status(200).json(cached);
    }

   
    const url = `https://www.anipub.xyz/api/findbyrating?page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from AniPub" });
    }

    const data: TopRatedAnimeP = await response.json();

    if (!data || !data.AniData) {
      return res.status(500).json({ error: "Invalid data structure from API" });
    }

  
    cache.set(key, data);
    console.log("Cached:", key);

    return res.status(200).json(data);

  } catch (err) {
    console.error("server error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};