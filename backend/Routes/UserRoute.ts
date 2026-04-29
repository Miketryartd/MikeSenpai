import express from "express";
import { UserRegister } from "../Controllers/UserRegisterController.js";
import {UserLogin} from "../Controllers/UserLoginController.js";
const router = express.Router();

router.post('/api/auth/register', UserRegister);
router.post('/api/auth/login', UserLogin);
export default router;