// backend/Controllers/FindByGenreController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;
const animeunity = new ANIME.AnimeUnity();

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
};

const getStringParam = (param: any): string => {
  if (!param) return "";
  if (Array.isArray(param)) return param[0];
  if (typeof param === 'string') return param;
  return "";
};

export const findByGenre = async (req: Request, res: Response) => {
  try {
    const genreParam = req.params.genre;
    const genre = getStringParam(genreParam);
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
    
      return res.status(200).json(cached.data);
    }

    let data = null;

    try {
      console.log(`Searching AnimeUnity for genre: ${genre}`);
      const searchResults = await animeunity.search(genre);
      if (searchResults.results && searchResults.results.length > 0) {
        const itemsPerPage = 20;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedResults = searchResults.results.slice(startIndex, endIndex);
        
        data = {
          currentPage: page,
          wholePage: paginatedResults.map((anime: any) => ({
            _id: anime.id,
            Name: getTitle(anime.title),
            ImagePath: anime.image || "",
            MALScore: (anime as any).rating || "N/A",
            RatingsNum: "0",
            DescripTion: (anime as any).description || "",
            finder: getTitle(anime.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }))
        };
        console.log(`AnimeUnity returned ${paginatedResults.length} results for genre: ${genre}`);
      }
    } catch (err) {
      console.log("AnimeUnity genre search failed:", err);
    }

    if (!data || !data.wholePage || data.wholePage.length === 0) {
      console.log(`Falling back to Anipub for genre: ${genre}`);
      try {
        const url = `https://anipub.xyz/api/findbyGenre/${genre}?Page=${page}`;
        const response = await fetch(url);
        if (response.ok) {
          data = await response.json();
          console.log(`Anipub returned results for genre: ${genre}`);
        }
      } catch (err) {
        console.log("Anipub genre search failed:", err);
      }
    }

    if (!data || !data.wholePage) {
      return res.status(200).json({ wholePage: [], currentPage: page });
    }

    cache.set(cacheKey, { data, timestamp: now });
    console.log(`Cached: ${cacheKey}`);

    return res.status(200).json(data);

  } catch (err) {
    console.error("Genre fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};