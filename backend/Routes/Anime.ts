import express from "express";
import { getAllAnime } from "../Controllers/AllAnimeController";
import { SearchAnime } from "../Controllers/SearchAnimeController";
const router = express.Router();


router.get('/api/animeAll', getAllAnime);
router.get('/api/searchAnime/:query', SearchAnime);
export default router;