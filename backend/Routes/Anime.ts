import express from "express";
import { getAllAnime } from "../Controllers/AllAnimeController";
import { SearchAnime } from "../Controllers/SearchAnimeController";
import {TopRatedAnime} from "../Controllers/TopRatedAnimeController";
import { getDetails } from "../Controllers/DetailAnimeController";
import { getStream } from "../Controllers/StreamAnimeController";
const router = express.Router();


router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
router.get('/api/topRated', TopRatedAnime );
router.get("/api/getAnimeDetail/:id", getDetails);
router.get('/api/getStream/:id', getStream);
export default router;