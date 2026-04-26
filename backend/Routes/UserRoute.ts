import express from "express";
import { UserRegister } from "../Controllers/UserRegisterController";

const router = express.Router();

router.post('/api/auth/register', UserRegister);

export default router;