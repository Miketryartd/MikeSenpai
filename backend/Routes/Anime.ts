import express from "express";
import { getAllAnime } from "../Controllers/AllAnimeController.js";
import { SearchAnime } from "../Controllers/SearchAnimeController.js";
import {TopRatedAnime} from "../Controllers/TopRatedAnimeController.js";
import { getDetails } from "../Controllers/DetailAnimeController.js";
import { getStream } from "../Controllers/StreamAnimeController.js";
import { findByGenre } from "../Controllers/FindByGenreController.js";

const router = express.Router();


router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
router.get('/api/topRated/:page', TopRatedAnime );
router.get("/api/getAnimeDetail/:id", getDetails);
router.get('/api/getStream/:id', getStream);
router.get('/api/findByGenre/:genre/', findByGenre);
export default router;