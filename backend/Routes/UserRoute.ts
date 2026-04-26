import express from "express";
import { UserRegister } from "../Controllers/UserRegisterController.js";

const router = express.Router();

router.post('/api/auth/register', UserRegister);

export default router;