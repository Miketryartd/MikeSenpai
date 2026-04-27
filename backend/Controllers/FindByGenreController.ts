import { Request, Response } from "express";


const cache = new Map<string, { data: unknown; timestamp: number }>();


const CACHE_TTL = 5 * 60 * 1000;

export const findByGenre = async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;

    if (!genre) {
      return res.status(400).json({ error: "Genre is required" });
    }

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }


    const cacheKey = `${genre}-${page}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

 
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit: ${cacheKey}`);
      return res.status(200).json(cached.data);
    }

 
    const url = `https://anipub.xyz/api/findbyGenre/${genre}?Page=${page}`;
    console.log("Calling AniPub:", url);

    const response = await fetch(url);
    console.log("AniPub responded with status:", response.status);


    if (response.status === 429) {
      return res.status(429).json({ 
        error: "Too many requests. Please wait a moment and try again." 
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from AniPub" });
    }

    const data = await response.json();

    if (!data || !data.wholePage) {
      return res.status(500).json({ error: "Invalid data structure from API" });
    }


    cache.set(cacheKey, { data, timestamp: now });
    console.log(`Cached: ${cacheKey}`);

    return res.status(200).json(data);

  } catch (err) {
    console.error("REAL ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};