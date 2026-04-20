import express from "express";
import { getAllAnime } from "../Controllers/AllAnime";

const router = express.Router();


router.get('/api/animeAll', getAllAnime);

export default router;