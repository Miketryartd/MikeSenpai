import express from "express";
import { getAllAnime } from "../Controllers/AllAnimeController.js";
import { SearchAnime } from "../Controllers/SearchAnimeController.js";
import {TopRatedAnime} from "../Controllers/TopRatedAnimeController.js";
import { getDetails } from "../Controllers/DetailAnimeController.js";
import { getStream } from "../Controllers/StreamAnimeController.js";
import { findByGenre } from "../Controllers/FindByGenreController.js";
import {getAnimeInfo} from "../Controllers/AnimeInfoController.js";
import { getTopRated, getTopRatedByType } from "../Controllers/AnimeKaiTopRatedController.js";
import { getNewReleases, getRecentlyUpdated, getRecentlyAdded, getLatestCompleted, getAnimeInfoWithRecommendations } from "../Controllers/AnimeKaiNewReleasesController.js";
const router = express.Router();

// AnimeKai Top Rated Routes
router.get('/api/animekai/top-rated', getTopRated);
router.get('/api/animekai/top-rated/:type', getTopRatedByType);

// AnimeKai New Releases Routes
router.get('/api/animekai/new-releases', getNewReleases);
router.get('/api/animekai/recently-updated', getRecentlyUpdated);
router.get('/api/animekai/recently-added', getRecentlyAdded);
router.get('/api/animekai/latest-completed', getLatestCompleted);
router.get('/api/animekai/info/:id', getAnimeInfoWithRecommendations);


//anipub
router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
router.get('/api/topRated/:page', TopRatedAnime );
router.get("/api/getAnimeDetail/:id", getDetails);
router.get('/api/getStream/:id', getStream);
router.get('/api/findByGenre/:genre/', findByGenre);
router.get('/api/getInfo/:id', getAnimeInfo);
export default router;