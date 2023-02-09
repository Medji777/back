import {Router} from "express";
import {login, meProfile} from "../controllers/auth.controller";
import {validateBodyLogin} from "../validations";
import {sanitizationBody, bearerAuthMiddleware as authMiddleware} from "../middlewares";

export const authRouter = Router({});

const sanitizationBodyLogin = sanitizationBody(['loginOrEmail','password'])

authRouter.post('/login',sanitizationBodyLogin,validateBodyLogin,login)
authRouter.get('/me',authMiddleware,meProfile)