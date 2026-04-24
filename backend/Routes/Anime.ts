import express from "express";
import { getAllAnime } from "../Controllers/AllAnimeController";
import { SearchAnime } from "../Controllers/SearchAnimeController";
import {TopRatedAnime} from "../Controllers/TopRatedAnimeController";
import { getDetails } from "../Controllers/DetailAnimeController";
const router = express.Router();


router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
router.get('/api/topRated', TopRatedAnime );
router.get("/api/getAnimeDetail/:id", getDetails);
export default router;