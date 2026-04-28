import express from "express";
import { pingBackend } from "../Controllers/Ping.js";

const router = express.Router();


router.get('/api/health', pingBackend);
export default router;


