import express from "express";
import { getAllAnime } from "../Controllers/AllAnimeController";
import { SearchAnime } from "../Controllers/SearchAnimeController";
import {TopRatedAnime} from "../Controllers/TopRatedAnimeController";
const router = express.Router();


router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
router.get('/api/topRated', TopRatedAnime );
export default router;