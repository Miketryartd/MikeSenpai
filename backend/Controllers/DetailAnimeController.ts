// backend/Controllers/DetailAnimeController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";

const animeunity = new ANIME.AnimeUnity();
const animekai = new ANIME.AnimeKai();
const cache = createCache<any>();

const getTitle = (title: any): string => {
  if (typeof title === 'string') return title;
  if (title?.english) return title.english;
  if (title?.romaji) return title.romaji;
  if (title?.native) return title.native;
  return "Unknown";
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
    let source = "animeunity";
    const isNumeric = /^\d+$/.test(id);
    const isAnimeUnityFormat = /^\d+-[a-z-]+$/.test(id);

    if (isNumeric || isAnimeUnityFormat) {
      let unityId = id;
      if (isAnimeUnityFormat) {
        unityId = id.split('-')[0];
      }
      
      try {
        console.log(`Fetching from AnimeUnity for ID: ${unityId}`);
        const info = await animeunity.fetchAnimeInfo(unityId);
        if (info && info.id) {
          data = { local: mapAnimeUnityToUI(info), source: "animeunity" };
          console.log(`AnimeUnity success for ID: ${unityId}`);
        }
      } catch (err) {
        console.log(`AnimeUnity error:`, err);
      }
    } else {
      try {
        console.log(`Fetching from AnimeKai for ID: ${id}`);
        const info = await animekai.fetchAnimeInfo(id);
        if (info && info.id) {
          data = { local: mapAnimeKaiToUI(info), source: "animekai" };
          console.log(`AnimeKai success for ID: ${id}`);
        }
      } catch (err) {
        console.log(`AnimeKai error:`, err);
      }
    }

    if (!data) {
      console.log(`Falling back to Anipub for ID: ${id}`);
      try {
        const response = await fetch(`https://anipub.xyz/anime/api/details/${id}`);
        if (response.ok) {
          const anipubData = await response.json();
          if (anipubData.local) {
            data = {
              local: {
                _id: anipubData.local._id,
                title: anipubData.local.Name,
                Name: anipubData.local.Name,
                ImagePath: anipubData.local.ImagePath,
                Cover: anipubData.local.Cover,
                DescripTion: anipubData.local.DescripTion,
                Genres: anipubData.local.Genres || [],
                epCount: anipubData.local.epCount || 0,
                Status: anipubData.local.Status,
                Duration: anipubData.local.Duration,
                MALScore: anipubData.local.MALScore,
                Studios: anipubData.local.Studios,
                Producers: anipubData.local.Producers,
                Premiered: anipubData.local.Premiered,
                Aired: anipubData.local.Aired,
                Synonyms: anipubData.local.Synonyms,
                RatingsNum: anipubData.local.RatingsNum || 0
              },
              source: "anipub"
            };
          }
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