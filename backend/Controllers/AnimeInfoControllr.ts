import { Request, Response } from "express";
import { createCache } from "../Utilities/cache.js";
import { AnimeInfo } from "../Type/Interface.js";

const cache = createCache<AnimeInfo>();

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

    
    const resp = await fetch(`https://anipub.xyz/api/info/${id}`);
    if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);

    const d = await resp.json();

 
    cache.set(key, d);
    console.log("Cached:", key);

    return res.status(200).json(d);

  } catch (err) {
    console.error("Server error", err);
    return res.status(500).json({ error: "internal error" });
  }
};