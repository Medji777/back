import {Router} from "express";
import {
    confirmation,
    emailResending,
    login, logout,
    meProfile,
    refreshToken,
    registration
} from "../controllers/auth.controller";
import {
    validateBodyLogin,
    validateExistUserOnEmailOrLogin,
    validationConfirmation,
    validationConfirmed
} from "../validations";
import {sanitizationBody, bearerAuthMiddleware as authMiddleware, limitIp} from "../middlewares";
import {validateBodyUser as validateBodyReg} from "../validations";
import {checkRefreshTokenMiddleware} from "../middlewares/auth";

export const authRouter = Router({});

const sanitizationBodyLogin = sanitizationBody(['loginOrEmail','password'])
const sanitizationBodyReg = sanitizationBody(['login','email','password'])

authRouter.post('/login',limitIp,sanitizationBodyLogin,validateBodyLogin,login)
authRouter.post('/refresh-token',checkRefreshTokenMiddleware,refreshToken)
authRouter.post('/logout',checkRefreshTokenMiddleware,logout)
authRouter.get('/me',authMiddleware,meProfile)
authRouter.post('/registration-confirmation',limitIp,validationConfirmation,confirmation)
authRouter.post(
    '/registration',
    limitIp,
    sanitizationBodyReg,
    validateBodyReg,
    validateExistUserOnEmailOrLogin,
    registration)
authRouter.post('/registration-email-resending',limitIp,validationConfirmed,emailResending)