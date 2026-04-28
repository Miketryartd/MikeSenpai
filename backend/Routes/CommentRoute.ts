import express from "express";
import { addComment } from "../Controllers/CommentsController.js";
import {authenticateToken} from "../Middleware/AuthCheck.js";
import {getComments} from "../Controllers/GetCommentsController.js";
const router = express.Router();

router.post('/api/auth/comment/:id/:finder', authenticateToken, addComment);
router.get('/api/auth/getComment/:id/:finder', getComments);

export default router;