import { Request, Response } from "express";
import { createCache } from "../Utilities/cache.js";

const cache = createCache<any>();

export const getStream = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing id" });

   
    const key = `stream-${id}`;
    const cached = cache.get(key);
    if (cached) {
      console.log("Cache hit:", key);
      return res.status(200).json(cached);
    }

  
    const url = `https://anipub.xyz/v1/api/details/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`AniPub stream ${response.status} for id: ${id}`);
      return res.status(response.status).json({ error: "Error connecting to api" });
    }

    const data = await response.json();
    if (!data) return res.status(404).json({ error: "Missing streaming links" });

    
    if (data.local?.ep) {
      data.local.ep = data.local.ep.filter(
        (e: any) => e?.link && typeof e.link === "string" && e.link.trim() !== ""
      );
    }

   
    cache.set(key, data);
    console.log("Cached:", key);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Stream fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};