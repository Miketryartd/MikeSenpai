// backend/Controllers/MultiProviderStreamController.ts
import { Request, Response } from "express";
import { ANIME, SubOrSub } from "@consumet/extensions";
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
    .replace(/-\w{4,6}$/, '')
    .replace(/-\d+[a-z]*$/, '')
    .replace(/-/g, ' ');
  
  cleaned = cleaned.replace(/\s+(season|part|cour|arc)\s+\d+$/i, '');
  cleaned = cleaned.replace(/\d+/g, '');
  
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

    console.log(`\n MultiProviderStream called with: ${animeId}`);

    if (!animeId) {
      return res.status(400).json({ error: "Missing id" });
    }

    const key = `multi-stream-${animeId}`;
    const cached = cache.get(key);
    if (cached) {
      console.log(` CACHE HIT - returning ${cached.local?.ep?.length || 0} episodes`);
      return res.status(200).json(cached);
    }

    let data = null;
    const isNumeric = /^\d+$/.test(animeId);
    const isAnimeUnityFormat = /^\d+-[a-z-]+$/.test(animeId);
    const isAnimeKaiFormat = /^[a-z][a-z0-9-]+-\w{4,6}$/.test(animeId);

    if (isNumeric) {
      console.log(`Numeric ID - trying Anipub`);
      try {
        const response = await fetch(`https://anipub.xyz/v1/api/details/${animeId}`);
        if (response.ok) {
          const streamData = await response.json();
          if (streamData?.local?.link || streamData?.local?.ep?.length) {
            const stripSrc = (link: string) => link.replace('src=', '');
            const episodes = [];
            if (streamData.local.link) {
              episodes.push({ link: stripSrc(streamData.local.link), number: 1 });
            }
            if (streamData.local.ep) {
              streamData.local.ep.forEach((ep: any, idx: number) => {
                episodes.push({ link: stripSrc(ep.link), number: idx + 2 });
              });
            }
            data = { source: "anipub", local: { _id: animeId, name: streamData.local.name, ep: episodes } };
          }
        }
      } catch (err) {}
    } 
    else if (isAnimeUnityFormat) {
      console.log(`AnimeUnity format - ${animeId}`);
      for (let i = 0; i < 3; i++) {
        try {
          const info = await animeunity.fetchAnimeInfo(animeId);
          if (info?.episodes?.length) {
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
            break;
          }
        } catch (err: any) {
          console.log(`Attempt ${i + 1} failed: ${err.message}`);
          if (err.message.includes('405') || err.message.includes('403')) {
            const proxyResult = await fetchViaProxy(`https://animeunity.to/anime/${animeId}`);
            if (proxyResult?.episodes) {
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
              break;
            }
          }
          if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    else if (isAnimeKaiFormat) {
      const extractedTitle = extractAnimeTitle(animeId);
      console.log(`AnimeKai format - searching for: ${extractedTitle}`);
      const searchResult = await searchAnimeUnity(extractedTitle);
      if (searchResult?.results?.length) {
        const bestMatch = searchResult.results[0];
        for (let i = 0; i < 3; i++) {
          try {
            const info = await animeunity.fetchAnimeInfo(bestMatch.id);
            if (info?.episodes?.length) {
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
              break;
            }
          } catch (err: any) {
            console.log(`Attempt ${i + 1} failed: ${err.message}`);
            if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }

    if (!data?.local?.ep?.length) {
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
    const language = req.query.lang as string || 'sub';
    let episodeId = getStringParam(episodeIdParam);

    console.log(`Episode source for: ${episodeId} (lang: ${language})`);

    if (!episodeId) {
      return res.status(400).json({ error: "No episode ID provided" });
    }

    if (episodeId.includes('gogoanime.com.by') || episodeId.includes('streaming.php')) {
      return res.json({
        provider: "anipub",
        sources: [{ url: episodeId, quality: "auto", isDub: false }],
        subtitles: []
      });
    }

    let sources = null;

    for (let i = 0; i < 3; i++) {
      try {
        const result = await animeunity.fetchEpisodeSources(episodeId);
        if (result.sources?.length) {
          sources = result;
          break;
        }
      } catch (err: any) {
        if (err.message.includes('405') || err.message.includes('403')) {
          const proxyResult = await fetchViaProxy(`https://animeunity.to/episode/${episodeId}`);
          if (proxyResult?.sources?.length) {
            sources = proxyResult;
            break;
          }
        }
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!sources?.sources?.length) {
      return res.status(404).json({ error: "No video sources found" });
    }

    const processedSources = sources.sources.map((source: any) => ({
      url: source.url,
      quality: source.quality || 'auto',
      isDub: source.isDub || false
    }));

    return res.json({
      provider: "animeunity",
      sources: processedSources,
      subtitles: sources.subtitles || []
    });

  } catch (error) {
    console.error("Episode source error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};