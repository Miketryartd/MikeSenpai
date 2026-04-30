// backend/Controllers/MultiProviderStreamController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";

const cache = createCache<any>();
const animeunity = new ANIME.AnimeUnity();

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

const extractAnimeNameFromKaiId = (kaiId: string): string => {
  let cleaned = kaiId.replace(/-[a-z0-9]*\d[a-z0-9]*$/i, '');
  cleaned = cleaned.replace(/-/g, ' ');
  return cleaned.trim();
};

const normalizeTitle = (title: string): string => {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
};

const resolveAnimeUnityId = async (kaiId: string): Promise<string | null> => {
  const animeName = extractAnimeNameFromKaiId(kaiId);
  console.log(`Resolving AnimeUnity ID — extracted name: "${animeName}" from "${kaiId}"`);

  const words = animeName.split(' ');
  const queriesToTry: string[] = [];
  for (let i = words.length; i >= 2; i--) {
    queriesToTry.push(words.slice(0, i).join(' '));
  }

  for (const query of queriesToTry) {
    console.log(`Searching AnimeUnity for: "${query}"`);
    try {
      const searchResults = await animeunity.search(query);
      if (!searchResults.results || searchResults.results.length === 0) continue;

      const normalizedSearch = normalizeTitle(query);
      let bestMatch = null;
      let bestScore = 0;

      for (const result of searchResults.results) {
        const resultTitle = getTitle(result.title);
        const normalizedResult = normalizeTitle(resultTitle);

        let score = 0;
        if (normalizedResult === normalizedSearch) score = 100;
        else if (normalizedResult.includes(normalizedSearch) || normalizedSearch.includes(normalizedResult)) score = 75;

        for (const word of normalizedSearch.split(' ')) {
          if (word.length > 2 && normalizedResult.includes(word)) score += 10;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = result;
        }
      }

      if (bestMatch && bestScore >= 20) {
        console.log(`Best AnimeUnity match: "${getTitle(bestMatch.title)}" (id: ${bestMatch.id}) with score ${bestScore} using query "${query}"`);
        return bestMatch.id;
      }
    } catch (err) {
      console.log(`Search failed for query "${query}":`, err);
    }
  }

  console.log(`No AnimeUnity results for: "${animeName}"`);
  return null;
};

export const getMultiProviderStream = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const animeId = getStringParam(idParam);

    console.log(`MultiProviderStream called with idParam: ${animeId}`);

    if (!animeId) {
      return res.status(400).json({ error: "Missing id" });
    }

    const key = `multi-stream-${animeId}`;
    const cached = cache.get(key);
    if (cached) {
      console.log("Cache hit:", key);
      return res.status(200).json(cached);
    }

    const isAnimeUnityId = /^\d+(-[a-z-]+)?$/.test(animeId);
    let resolvedId = animeId;

    if (!isAnimeUnityId) {
      console.log(`"${animeId}" looks like an AnimeKai ID — searching AnimeUnity...`);
      try {
        const found = await resolveAnimeUnityId(animeId);
        if (!found) {
          return res.status(404).json({ error: `Could not find AnimeUnity match for: ${animeId}` });
        }
        resolvedId = found;
        console.log(`Resolved AnimeUnity ID: ${resolvedId}`);
      } catch (err) {
        console.log("AnimeUnity search/resolve failed:", err);
        return res.status(404).json({ error: `Failed to resolve AnimeUnity ID for: ${animeId}` });
      }
    }

    let data = null;

    try {
      console.log(`Fetching AnimeUnity info for resolved ID: ${resolvedId}`);
      const info = await animeunity.fetchAnimeInfo(resolvedId);
      if (info && info.episodes && info.episodes.length > 0) {
        data = {
          source: "animeunity",
          local: {
            _id: info.id,
            name: getTitle(info.title),
            ep: info.episodes.map((ep: any) => ({
              link: ep.id,
              number: ep.number,
              title: ep.title || `Episode ${ep.number}`,
              image: ep.image || ""
            })),
          }
        };
        console.log(`AnimeUnity returned ${info.episodes.length} episodes`);
      }
    } catch (err) {
      console.log("AnimeUnity fetchAnimeInfo failed:", err);
    }

    if (!data || !data.local?.ep?.length) {
      console.log(`No episodes found for resolved ID: ${resolvedId}`);
      return res.status(404).json({ error: `No episodes found for ID: ${animeId}` });
    }

    cache.set(key, data);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Multi-provider stream error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMultiProviderEpisodeSource = async (req: Request, res: Response) => {
  try {
    const episodeIdParam = req.params.episodeId;
    const episodeId = getStringParam(episodeIdParam);

    console.log(`getMultiProviderEpisodeSource called with: ${episodeId}`);

    if (!episodeId) {
      return res.status(400).json({ error: "No episode ID provided" });
    }

    let sources = null;

    try {
      console.log(`Getting sources from AnimeUnity for: ${episodeId}`);
      const result = await animeunity.fetchEpisodeSources(episodeId);
      if (result.sources && result.sources.length > 0) {
        sources = result;
        console.log(`AnimeUnity returned ${result.sources.length} sources`);
      }
    } catch (err) {
      console.log(`AnimeUnity episode source failed:`, err);
    }

    if (!sources || !sources.sources || sources.sources.length === 0) {
      return res.status(404).json({ error: "No video sources found" });
    }

    return res.json({
      provider: "animeunity",
      sources: sources.sources,
      subtitles: sources.subtitles || []
    });

  } catch (error) {
    console.error("Multi-provider episode source error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};