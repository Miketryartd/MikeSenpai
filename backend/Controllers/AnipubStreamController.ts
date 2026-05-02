// backend/Controllers/AnipubStreamController.ts
import { Request, Response } from "express";
import { createCache } from "../Utilities/cache.js";

const cache = createCache<any>();

export const getAnipubStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const key = `anipub-stream-${id}`;
    const cached = cache.get(key);
    if (cached) {
      return res.status(200).json(cached);
    }

    const url = `https://anipub.xyz/v1/api/details/${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: "Error connecting to Anipub API" });
    }

    const data = await response.json();
    
    if (!data || !data.local) {
      return res.status(404).json({ error: "Missing streaming links" });
    }

    const stripSrc = (link: string) => link.replace('src=', '');
    
    const episodes = [];
    if (data.local.link) {
      episodes.push({ number: 1, link: stripSrc(data.local.link) });
    }
    if (data.local.ep && Array.isArray(data.local.ep)) {
      data.local.ep.forEach((ep: any, index: number) => {
        episodes.push({ number: index + 2, link: stripSrc(ep.link) });
      });
    }

    const result = {
      source: "anipub",
      local: {
        _id: id,
        name: data.local.name,
        ep: episodes
      }
    };

    cache.set(key, result);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Anipub stream error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};