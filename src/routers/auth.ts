import {Router} from "express";
import {login} from "../controllers/auth.controller";
import {validateBodyLogin} from "../validations";
import {sanitizationBody} from "../middlewares";

export const authRouter = Router({});

const sanitizationBodyLogin = sanitizationBody(['loginOrEmail','password'])

authRouter.post('/login',sanitizationBodyLogin,validateBodyLogin,login)