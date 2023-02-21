import {Router} from "express";
import {confirmation, emailResending, login, meProfile, registration} from "../controllers/auth.controller";
import {
    validateBodyLogin,
    validateExistUserOnEmailOrLogin,
    validationConfirmation,
    validationConfirmed
} from "../validations";
import {sanitizationBody, bearerAuthMiddleware as authMiddleware} from "../middlewares";
import {validateBodyUser as validateBodyReg} from "../validations";

export const authRouter = Router({});

const sanitizationBodyLogin = sanitizationBody(['loginOrEmail','password'])
const sanitizationBodyReg = sanitizationBody(['login','email','password'])

authRouter.post('/login',sanitizationBodyLogin,validateBodyLogin,login)
authRouter.get('/me',authMiddleware,meProfile)
authRouter.post('/registration-confirmation',validationConfirmation,confirmation)
authRouter.post(
    '/registration',
    sanitizationBodyReg,
    validateBodyReg,
    validateExistUserOnEmailOrLogin,
    registration)
authRouter.post('/registration-email-resending',validationConfirmed,emailResending)