// backend/Controllers/DetailAnimeController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";
import { fetchWithRetry } from "../Utilities/fetchWithRetry.js";

const animeunity = new ANIME.AnimeUnity();
const animekai = new ANIME.AnimeKai();
const cache = createCache<any>();

const isAnipubFormat = (id: string): boolean => {
  return /^\d+$/.test(id) || /^[a-z][a-z0-9-]+$/.test(id);
};

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
};

const fetchViaProxy = async (url: string): Promise<any> => {
  const proxyServers = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://proxy.cors.sh/${url}`,
  ];
  
  for (const proxyUrl of proxyServers) {
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {}
  }
  return null;
};

const fetchAnimeInfoWithFallback = async (id: string, isAnimeUnity: boolean = false) => {
  for (let i = 0; i < 3; i++) {
    try {
      if (isAnimeUnity) {
        const result = await animeunity.fetchAnimeInfo(id);
        if (result && result.id) return result;
      } else {
        const result = await animekai.fetchAnimeInfo(id);
        if (result && result.id) return result;
      }
    } catch (err: any) {
      console.log(`Attempt ${i + 1} failed for ${isAnimeUnity ? 'AnimeUnity' : 'AnimeKai'} ID ${id}: ${err.message}`);
      
      if (isAnimeUnity && (err.message.includes('405') || err.message.includes('403') || err.message.includes('fetch'))) {
        console.log(`Trying proxy for AnimeUnity ID: ${id}`);
        const proxyData = await fetchViaProxy(`https://animeunity.to/anime/${id}`);
        if (proxyData && proxyData.id) {
          return proxyData;
        }
      }
      
      if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
};

const mapAnimeKaiToUI = (info: any) => {
  return {
    _id: info.id,
    title: info.title,
    Name: info.title,
    ImagePath: info.image || "",
    Cover: info.image || "",
    DescripTion: info.description || "No description available.",
    Genres: info.genres || [],
    epCount: info.totalEpisodes || 0,
    Status: info.status || "Unknown",
    Duration: info.type || "TV",
    MALScore: info.rating?.toString() || "N/A",
    Studios: "Unknown",
    Producers: "Unknown",
    Premiered: info.releaseDate || "Unknown",
    Aired: info.releaseDate || "Unknown",
    Synonyms: info.otherName || "",
    RatingsNum: info.rating ? Math.floor(info.rating * 10) : 0
  };
};

const mapAnimeUnityToUI = (info: any) => {
  const title = getTitle(info.title);
  return {
    _id: info.id,
    title: title,
    Name: title,
    ImagePath: info.image || "",
    Cover: info.cover || info.image || "",
    DescripTion: info.description || "No description available.",
    Genres: info.genres || [],
    epCount: info.totalEpisodes || info.episodes?.length || 0,
    Status: info.status || "Unknown",
    Duration: info.type || "TV",
    MALScore: info.rating?.toString() || "N/A",
    Studios: info.studios?.join(", ") || "Unknown",
    Producers: info.producers?.join(", ") || "Unknown",
    Premiered: info.releaseDate || info.startDate || "Unknown",
    Aired: info.releaseDate || info.startDate || "Unknown",
    Synonyms: info.synonyms?.join(", ") || "",
    RatingsNum: info.rating ? Math.floor(info.rating * 10) : 0
  };
};


// backend/Controllers/DetailAnimeController.ts
export const getDetails = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const key = `detail-${id}`;
    const cached = cache.get(key);
    if (cached) {
      return res.status(200).json(cached);
    }

    let data = null;
    const isNumeric = /^\d+$/.test(id);
    const isAnimeUnityFormat = /^\d+-[a-z-]+$/.test(id);
    const isAnimeKaiFormat = /^[a-z][a-z0-9-]+-\d+[a-z]*$/.test(id);
    const isAnipubSlug = /^[a-z][a-z0-9-]+$/.test(id) && !isAnimeKaiFormat;

    if (isAnimeUnityFormat) {
      let unityId = id.split('-')[0];
      console.log(`Fetching AnimeUnity for ID: ${unityId}`);
      const info = await fetchAnimeInfoWithFallback(unityId, true);
      if (info && info.id) {
        data = { local: mapAnimeUnityToUI(info), source: "animeunity" };
      }
    } else if (isAnimeKaiFormat) {
      console.log(`Fetching AnimeKai for ID: ${id}`);
      const info = await fetchAnimeInfoWithFallback(id, false);
      if (info && info.id) {
        data = { local: mapAnimeKaiToUI(info), source: "animekai" };
      }
    } else if (isNumeric || isAnipubSlug) {
      console.log(`Fetching Anipub for ID/slug: ${id}`);
      try {
       const response = await fetchWithRetry(`https://anipub.xyz/api/info/${id}`);
        if (response.ok) {
          const info = await response.json();
          const fixImage = (path: string) => path?.startsWith('https://') ? path : `https://anipub.xyz/${path}`;
          data = {
            local: {
              _id: info._id,
              title: info.Name,
              Name: info.Name,
              ImagePath: fixImage(info.ImagePath),
              Cover: fixImage(info.Cover),
              DescripTion: info.DescripTion || "No description available.",
              Genres: info.Genres || [],
              epCount: info.epCount || 0,
              Status: info.Status || "Unknown",
              Duration: info.Duration || "TV",
              MALScore: info.MALScore || "N/A",
              Studios: info.Studios || "Unknown",
              Producers: info.Producers || "Unknown",
              Premiered: info.Premiered || "Unknown",
              Aired: info.Aired || "Unknown",
              Synonyms: info.Synonyms || "",
              RatingsNum: info.RatingsNum || 0,
              source: "anipub"
            },
            source: "anipub"
          };
          console.log(`Anipub success for ID: ${id}`);
        }
      } catch (err) {
        console.log(`Anipub error:`, err);
      }
    }

    if (!data) {
      return res.status(404).json({ error: `No data found for ID: ${id}` });
    }

    cache.set(key, data);
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error fetching details:", error);
    return res.status(500).json({ error: "server error" });
  }
};