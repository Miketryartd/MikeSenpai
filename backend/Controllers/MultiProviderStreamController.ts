// backend/Controllers/MultiProviderStreamController.ts
import { Request, Response } from "express";
import { ANIME } from "@consumet/extensions";
import { createCache } from "../Utilities/cache.js";
import { fetchViaCloudflareProxy } from "../Utilities/worker.js";
import { fetchWithRetry } from "../Utilities/fetchWithRetry.js";
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



const fetchViaProxy = async (url: string): Promise<any> => {
 
  const cloudflareWorkerUrl = process.env.CLOUDFLARE_WORKER_URL || 'https://animeunityproxy.mikeleano26.workers.dev';
  
  try {
    const proxyUrl = `${cloudflareWorkerUrl}?url=${encodeURIComponent(url)}`;
    console.log(`Trying Cloudflare Worker proxy: ${proxyUrl}`);
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      console.log(`Cloudflare Worker proxy success`);
      return data;
    }
  } catch (err) {
    console.log(`Cloudflare Worker proxy failed:`, err);
  }
  

  const proxyServers = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://proxy.cors.sh/${url}`,
  ];
  
  for (const proxyUrl of proxyServers) {
    try {
      console.log(`Trying fallback proxy: ${proxyUrl.substring(0, 80)}...`);
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {}
  }
  return null;
};
const extractAnimeTitle = (kaiId: string): string => {
  let cleaned = kaiId
    .replace(/-\d+[a-z]*$/, '')
    .replace(/-[a-z0-9]{4,}$/, '')
    .replace(/-/g, ' ');
  
  cleaned = cleaned.replace(/\s+(season|part|cour|arc)\s+\d+$/i, '');
  
  return cleaned.trim();
};

const searchAnimeUnity = async (title: string): Promise<any> => {
  for (let i = 0; i < 3; i++) {
    try {
      const result = await animeunity.search(title);
      if (result.results && result.results.length > 0) {
        return result;
      }
    } catch (err: any) {
      if (err.message.includes('405') || err.message.includes('403')) {
        const proxyResult = await fetchViaProxy(`https://animeunity.to/api/search?q=${encodeURIComponent(title)}`);
        if (proxyResult && proxyResult.results) {
          return proxyResult;
        }
      }
      if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
};

export const getMultiProviderStream = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    let animeId = getStringParam(idParam);

    console.log(`MultiProviderStream called with: ${animeId}`);

    if (!animeId) {
      return res.status(400).json({ error: "Missing id" });
    }

    const key = `multi-stream-${animeId}`;
    const cached = cache.get(key);
    if (cached) {
      return res.status(200).json(cached);
    }

    let data = null;
    const isNumeric = /^\d+$/.test(animeId);
    const isAnimeUnityFormat = /^\d+-[a-z-]+$/.test(animeId);
    const isAnimeKaiFormat = /^[a-z][a-z0-9-]+-\d+[a-z]*$/.test(animeId);

    if (isNumeric) {
      console.log(`Numeric ID ${animeId} - trying Anipub first`);
      try {
       
       const response = await fetchWithRetry(`https://anipub.xyz/v1/api/details/${animeId}`);
        
        if (response.ok) {
          const streamData = await response.json();
          if (streamData && streamData.local && (streamData.local.link || streamData.local.ep?.length)) {
            const stripSrc = (link: string) => link.replace('src=', '');
            
            const episodes = [];
            if (streamData.local.link) {
              episodes.push({ link: stripSrc(streamData.local.link), number: 1, title: "Episode 1" });
            }
            if (streamData.local.ep && Array.isArray(streamData.local.ep)) {
              streamData.local.ep.forEach((ep: any, index: number) => {
                episodes.push({ 
                  link: stripSrc(ep.link), 
                  number: index + 2, 
                  title: `Episode ${index + 2}` 
                });
              });
            }
            
            data = {
              source: "anipub",
              local: {
                _id: animeId,
                name: streamData.local.name || "Unknown",
                ep: episodes
              }
            };
            console.log(`Anipub returned ${episodes.length} episodes for ID ${animeId}`);
          }
        } else {
          console.log(`Anipub returned ${response.status} for ID ${animeId}`);
        }
      } catch (err) {
        console.log(`Anipub stream failed:`, err);
      }
    } else if (isAnimeUnityFormat) {
      let resolvedId = animeId.split('-')[0];
      console.log(`AnimeUnity format ID: ${resolvedId}`);
      
      for (let i = 0; i < 3; i++) {
        try {
          console.log(`Fetching episodes from AnimeUnity for ID: ${resolvedId}`);
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
            break;
          }
        } catch (err: any) {
          console.log(`Attempt ${i + 1} failed: ${err.message}`);
          if (err.message.includes('405') || err.message.includes('403')) {
            console.log(`Trying proxy for AnimeUnity ID: ${resolvedId}`);
            const proxyResult = await fetchViaProxy(`https://animeunity.to/anime/${resolvedId}`);
            if (proxyResult && proxyResult.episodes) {
              data = {
                source: "animeunity",
                local: {
                  _id: proxyResult.id,
                  name: getTitle(proxyResult.title),
                  ep: proxyResult.episodes.map((ep: any) => ({
                    link: ep.id,
                    number: ep.number,
                    title: ep.title || `Episode ${ep.number}`,
                    image: ep.image || ""
                  })),
                }
              };
              console.log(`Proxy returned ${proxyResult.episodes.length} episodes`);
              break;
            }
          }
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } else if (isAnimeKaiFormat) {
      const extractedTitle = extractAnimeTitle(animeId);
      console.log(`Extracted title from AnimeKai ID "${animeId}": "${extractedTitle}"`);
      
      const searchResult = await searchAnimeUnity(extractedTitle);
      
      if (searchResult && searchResult.results && searchResult.results.length > 0) {
        const bestMatch = searchResult.results[0];
        let resolvedId = bestMatch.id;
        console.log(`Found AnimeUnity ID: ${resolvedId} for title: ${getTitle(bestMatch.title)}`);
        
        for (let i = 0; i < 3; i++) {
          try {
            console.log(`Fetching episodes from AnimeUnity for ID: ${resolvedId}`);
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
              break;
            }
          } catch (err: any) {
            console.log(`Attempt ${i + 1} failed: ${err.message}`);
            if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } else {
        console.log(`No AnimeUnity match found for: ${extractedTitle}`);
        return res.status(404).json({ error: `Could not find anime: ${extractedTitle}` });
      }
    }

    if (!data || !data.local?.ep?.length) {
      return res.status(404).json({ error: `No episodes found for: ${animeId}` });
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
    let episodeId = getStringParam(episodeIdParam);

    console.log(`Episode source requested for: ${episodeId}`);

    if (!episodeId) {
      return res.status(400).json({ error: "No episode ID provided" });
    }

    let sources = null;

    if (episodeId.includes('gogoanime.com.by') || episodeId.includes('streaming.php')) {
      console.log(`Episode is from Gogoanime/Anipub - using direct embed URL`);
      return res.json({
        provider: "anipub",
        sources: [{ url: episodeId, quality: "auto", isM3U8: false }],
        subtitles: []
      });
    }

    for (let i = 0; i < 3; i++) {
      try {
        const result = await animeunity.fetchEpisodeSources(episodeId);
        if (result.sources && result.sources.length > 0) {
          sources = result;
          console.log(`AnimeUnity returned ${result.sources.length} sources`);
          break;
        }
      } catch (err: any) {
        console.log(`Attempt ${i + 1} failed: ${err.message}`);
        
        if (err.message.includes('405') || err.message.includes('403')) {
          const proxyResult = await fetchViaProxy(`https://animeunity.to/episode/${episodeId}`);
          if (proxyResult && proxyResult.sources) {
            sources = proxyResult;
            console.log(`Proxy returned ${proxyResult.sources.length} sources`);
            break;
          }
        }
        
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
      }
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