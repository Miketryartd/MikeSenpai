// backend/Routes/Anime.ts
import express from "express";
import { ANIME } from "@consumet/extensions";
import { getAllAnime } from "../Controllers/AllAnimeController.js";
import { SearchAnime } from "../Controllers/SearchAnimeController.js";
import { TopRatedAnime } from "../Controllers/TopRatedAnimeController.js";
import { getDetails } from "../Controllers/DetailAnimeController.js";
import { getStream } from "../Controllers/StreamAnimeController.js";
import { findByGenre } from "../Controllers/FindByGenreController.js";
import { getAnimeInfo } from "../Controllers/AnimeInfoController.js";
import { getTopRated } from "../Controllers/AnimeKaiTopRatedController.js";
import { getNewReleases } from "../Controllers/AnimeKaiNewReleasesController.js";
import {
  getMultiProviderStream,
  getMultiProviderEpisodeSource
} from "../Controllers/MultiProviderStreamController.js";
import {
  testAllProvidersSearch,
  testAllProvidersAnimeInfo,
  testAllProvidersEpisodeSources,
  testPlayWithBestProvider,
  testFindWorkingEpisodeId
} from "../Controllers/TestMultiProviderController.js";
import {
  unifiedSearch,
  unifiedDetails,
  unifiedInfo
} from "../Controllers/AnimeUnityPrimaryController.js";
import {
  mapAnimeKaiToAnimeUnity,
  testSearch
} from "../Controllers/AnimeUnityMapperController.js";

const router = express.Router();

//search
router.get('/api/unified/search/:query', unifiedSearch);
router.get('/api/unified/detail/:id', unifiedDetails);
router.get('/api/unified/info/:id', unifiedInfo);

//test
router.get('/api/test/multi/search/:query', testAllProvidersSearch);
router.get('/api/test/multi/info/:animeId', testAllProvidersAnimeInfo);
router.get('/api/test/multi/episode/:episodeId', testAllProvidersEpisodeSources);
router.get('/api/test/multi/play/:episodeId', testPlayWithBestProvider);
router.get('/api/test/multi/find-id/:animeQuery', testFindWorkingEpisodeId);
router.get('/api/test/search/:query', testSearch);

router.get('/api/test', (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

// Also add a test for the map route specifically
router.get('/api/map/test-route', (req, res) => {
  res.json({ message: "Map route prefix is working" });
})

//anipub test
router.get('/api/test-anipub', async (req, res) => {
  try {
    const response = await fetch('https://anipub.xyz/api/topRated/1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });
    res.json({ 
      status: response.status, 
      ok: response.ok,
      message: response.status === 403 ? 'Anipub is blocking your IP' : 'Working'
    });
  } catch (err: any) {
    res.json({ error: err.message });
  }
});


//animekai test
router.get('/api/animekai/test', async (req, res) => {
  try {
    const animekai = new ANIME.AnimeKai();
    const result = await animekai.search("naruto", 1);
    res.json({ 
      success: true, 
      hasResults: result?.results?.length > 0,
      resultCount: result?.results?.length,
      firstResult: result?.results?.[0] 
    });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});
router.get('/api/map/animekai-test/:animeKaiId', async (req, res) => {
  res.json({ 
    message: "Map endpoint is reachable", 
    id: req.params.animeKaiId,
    timestamp: new Date().toISOString()
  });
});

//ui routes
router.get('/api/map/animekai/:animeKaiId', mapAnimeKaiToAnimeUnity);

router.get('/api/multi/stream/:id', getMultiProviderStream);
router.get('/api/multi/episode-source/:episodeId', getMultiProviderEpisodeSource);


router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
router.get('/api/topRated/:page', TopRatedAnime);
router.get("/api/getAnimeDetail/:id", getDetails);
router.get('/api/getStream/:id', getStream);
router.get('/api/findByGenre/:genre/', findByGenre);
router.get('/api/getInfo/:id', getAnimeInfo);

router.get('/api/animekai/top-rated', getTopRated);
router.get('/api/animekai/new-releases', getNewReleases);

export default router;