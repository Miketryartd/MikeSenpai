import express from "express";
import { addComment } from "../Controllers/CommentsController.js";
import {authenticateToken} from "../Middleware/AuthCheck.js";
const router = express.Router();

router.post('/api/auth/comment/:id/:finder', authenticateToken, addComment);

export default router;