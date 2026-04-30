// backend/Controllers/TestMultiProviderController.ts
import { Request, Response } from "express";
import { ANIME, SubOrSub } from "@consumet/extensions";

const providers = {
  hianime: new ANIME.Hianime(),
  animepahe: new ANIME.AnimePahe(),
  animekai: new ANIME.AnimeKai(),
  animesaturn: new ANIME.AnimeSaturn(),
  animeunity: new ANIME.AnimeUnity(),
  animesama: new ANIME.AnimeSama(),
  kickassanime: new ANIME.KickAssAnime(),
};

type ProviderName = keyof typeof providers;

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

export const testAllProvidersSearch = async (req: Request, res: Response) => {
  try {
    const query = getStringParam(req.params.query);
    if (!query) {
      return res.status(400).json({ error: "No search query" });
    }

    const results = [];

    for (const [name, provider] of Object.entries(providers)) {
      try {
        console.log(`Testing ${name} for search: ${query}`);
        const startTime = Date.now();
        const result = await provider.search(query);
        const responseTime = Date.now() - startTime;

        results.push({
          provider: name,
          success: true,
          responseTime: `${responseTime}ms`,
          resultCount: result.results?.length || 0,
          firstResult: result.results?.[0] ? {
            id: result.results[0].id,
            title: getTitle(result.results[0].title),
            image: result.results[0].image?.substring(0, 50)
          } : null
        });
      } catch (err: any) {
        results.push({
          provider: name,
          success: false,
          error: err.message
        });
      }
    }

    const workingProviders = results.filter(r => r.success);
    const failedProviders = results.filter(r => !r.success);

    return res.json({
      success: true,
      searchQuery: query,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        working: workingProviders.length,
        failed: failedProviders.length
      },
      workingProviders: workingProviders,
      failedProviders: failedProviders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const testAllProvidersAnimeInfo = async (req: Request, res: Response) => {
  try {
    const animeId = getStringParam(req.params.animeId);
    if (!animeId) {
      return res.status(400).json({ error: "No anime ID" });
    }

    const results = [];

    for (const [name, provider] of Object.entries(providers)) {
      try {
        console.log(`Testing ${name} for anime info: ${animeId}`);
        const startTime = Date.now();
        const info = await (provider as any).fetchAnimeInfo(animeId);
        const responseTime = Date.now() - startTime;

        results.push({
          provider: name,
          success: true,
          responseTime: `${responseTime}ms`,
          title: getTitle(info.title),
          totalEpisodes: info.totalEpisodes || info.episodes?.length || 0,
          hasDescription: !!info.description,
          hasImage: !!info.image,
          episodeCount: info.episodes?.length || 0,
          firstEpisodeId: info.episodes?.[0]?.id || null
        });
      } catch (err: any) {
        results.push({
          provider: name,
          success: false,
          error: err.message
        });
      }
    }

    const workingProviders = results.filter(r => r.success);
    const failedProviders = results.filter(r => !r.success);

    return res.json({
      success: true,
      animeId: animeId,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        working: workingProviders.length,
        failed: failedProviders.length
      },
      workingProviders: workingProviders,
      failedProviders: failedProviders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const testAllProvidersEpisodeSources = async (req: Request, res: Response) => {
  try {
    const episodeId = getStringParam(req.params.episodeId);
    if (!episodeId) {
      return res.status(400).json({ error: "No episode ID" });
    }

    const results = [];

    for (const [name, provider] of Object.entries(providers)) {
      try {
        console.log(`Testing ${name} for episode sources: ${episodeId}`);
        const startTime = Date.now();
        const sources = await (provider as any).fetchEpisodeSources(episodeId);
        const responseTime = Date.now() - startTime;

        results.push({
          provider: name,
          success: true,
          responseTime: `${responseTime}ms`,
          sourcesCount: sources.sources?.length || 0,
          qualities: sources.sources?.map((s: any) => s.quality) || [],
          hasSubtitles: (sources.subtitles?.length || 0) > 0,
          firstSourceUrl: sources.sources?.[0]?.url?.substring(0, 80) || null
        });
      } catch (err: any) {
        results.push({
          provider: name,
          success: false,
          error: err.message
        });
      }
    }

    const workingProviders = results.filter(r => r.success && r.sourcesCount > 0);
    const failedProviders = results.filter(r => !r.success || r.sourcesCount === 0);

    return res.json({
      success: true,
      episodeId: episodeId,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        working: workingProviders.length,
        failed: failedProviders.length
      },
      workingProviders: workingProviders,
      failedProviders: failedProviders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const testPlayWithBestProvider = async (req: Request, res: Response) => {
  try {
    const episodeId = getStringParam(req.params.episodeId);
    if (!episodeId) {
      return res.status(400).send("No episode ID provided");
    }

    let workingSource = null;
    let workingProvider = null;

    for (const [name, provider] of Object.entries(providers)) {
      try {
        const sources = await (provider as any).fetchEpisodeSources(episodeId);
        if (sources.sources && sources.sources.length > 0) {
          workingSource = sources;
          workingProvider = name;
          console.log(`Found working source with ${name}`);
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!workingSource || !workingSource.sources || workingSource.sources.length === 0) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>No Sources Found</title></head>
        <body style="background: black; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; text-align: center;">
          <div>
            <h1>No Video Sources Found</h1>
            <p>Episode ID: ${episodeId}</p>
            <p>Tried all providers but none returned working sources.</p>
            <button onclick="history.back()" style="background: #6c47ff; border: none; color: white; padding: 10px 20px; border-radius: 8px; margin-top: 20px; cursor: pointer;">Go Back</button>
          </div>
        </body>
        </html>
      `);
    }

    const videoUrl = workingSource.sources[0]?.url;
    const qualities = workingSource.sources.map((s: any) => ({ quality: s.quality, url: s.url }));

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Multi-Provider Player - ${workingProvider}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { margin: 0; background: black; font-family: system-ui; }
          .container { display: flex; flex-direction: column; height: 100vh; }
          .video-container { flex: 1; background: black; }
          video { width: 100%; height: 100%; }
          .controls {
            background: #1a1a2e;
            padding: 12px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            border-top: 1px solid #2d2d4a;
          }
          button {
            background: #6c47ff;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
          }
          button:hover { background: #5835cc; }
          .quality-select {
            background: #0d0d14;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #6c47ff;
            cursor: pointer;
          }
          .info {
            background: #0d0d14;
            padding: 8px 16px;
            border-radius: 8px;
            color: #a0a0a0;
            font-size: 12px;
          }
          .success { color: #00ff88; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="video-container">
            <video id="video-player" controls autoplay crossorigin="anonymous">
              <source src="${videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="controls">
            <div class="info">Provider: <span class="success">${workingProvider}</span></div>
            <div class="info">Episode: ${episodeId.substring(0, 40)}...</div>
            <select id="quality-select" class="quality-select">
              ${qualities.map((q: any, i: number) => 
                `<option value="${q.url}" ${i === 0 ? 'selected' : ''}>${q.quality || 'Auto'}</option>`
              ).join('')}
            </select>
            <button onclick="changeQuality()">Change Quality</button>
            <button onclick="toggleFullscreen()">Fullscreen</button>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </div>
        <script>
          const video = document.getElementById('video-player');
          const qualitySelect = document.getElementById('quality-select');
          function changeQuality() {
            const newSrc = qualitySelect.value;
            const currentTime = video.currentTime;
            const wasPlaying = !video.paused;
            video.src = newSrc;
            video.load();
            video.currentTime = currentTime;
            if (wasPlaying) video.play();
          }
          function toggleFullscreen() {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    res.status(500).send(`<html><body style="background:black;color:white;"><h1>Error: ${error.message}</h1></body></html>`);
  }
};

export const testFindWorkingEpisodeId = async (req: Request, res: Response) => {
  try {
    const animeQuery = getStringParam(req.params.animeQuery);
    if (!animeQuery) {
      return res.status(400).json({ error: "No anime query" });
    }

    const results = [];

    for (const [name, provider] of Object.entries(providers)) {
      try {
        console.log(`Searching ${name} for: ${animeQuery}`);
        const searchResult = await provider.search(animeQuery);
        
        if (searchResult.results && searchResult.results.length > 0) {
          const firstAnime = searchResult.results[0];
          const animeId = firstAnime.id;
          
          try {
            const info = await (provider as any).fetchAnimeInfo(animeId);
            const firstEpisodeId = info.episodes?.[0]?.id || null;
            
            results.push({
              provider: name,
              success: true,
              animeId: animeId,
              animeTitle: getTitle(firstAnime.title),
              totalEpisodes: info.totalEpisodes || info.episodes?.length || 0,
              firstEpisodeId: firstEpisodeId
            });
          } catch (infoErr: any) {
            results.push({
              provider: name,
              success: false,
              error: `Search worked but fetchAnimeInfo failed: ${infoErr.message}`
            });
          }
        } else {
          results.push({
            provider: name,
            success: false,
            error: "No search results"
          });
        }
      } catch (err: any) {
        results.push({
          provider: name,
          success: false,
          error: err.message
        });
      }
    }

    const workingProviders = results.filter(r => r.success && r.firstEpisodeId);
    const bestProvider = workingProviders[0] || null;

    return res.json({
      success: workingProviders.length > 0,
      searchQuery: animeQuery,
      timestamp: new Date().toISOString(),
      bestProvider: bestProvider,
      allResults: results,
      message: bestProvider 
        ? `Found working provider: ${bestProvider.provider}. Use episode ID: ${bestProvider.firstEpisodeId}`
        : "No working provider found"
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};