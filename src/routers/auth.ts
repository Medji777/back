import {Router} from "express";
import {authController} from "../controllers";
import {
    validateBodyLogin,
    validateExistUserOnEmailOrLogin,
    validationConfirmation,
    validationConfirmed,
    validationPasswordRecovery,
    validationNewPassword,
} from "../validations";
import {sanitizationBody, bearerAuthMiddleware as authMiddleware, limitIp} from "../middlewares";
import {validateBodyUser as validateBodyReg} from "../validations";
import {checkRefreshTokenMiddleware} from "../middlewares/auth";

export const authRouter = Router({});

const sanitizationBodyLogin = sanitizationBody(['loginOrEmail','password'])
const sanitizationBodyReg = sanitizationBody(['login','email','password'])
const sanitizationBodyNewPass = sanitizationBody(['recoveryCode','newPassword'])

authRouter.post('/login',limitIp,sanitizationBodyLogin,validateBodyLogin,authController.login)
authRouter.post('/refresh-token',checkRefreshTokenMiddleware,authController.refreshToken)
authRouter.post('/logout',checkRefreshTokenMiddleware,authController.logout)
authRouter.get('/me',authMiddleware,authController.meProfile)
authRouter.post(
    '/registration',
    limitIp,
    sanitizationBodyReg,
    validateBodyReg,
    validateExistUserOnEmailOrLogin,
    authController.registration)
authRouter.post('/registration-confirmation',limitIp,validationConfirmation,authController.confirmation)
authRouter.post('/registration-email-resending',limitIp,validationConfirmed,authController.emailResending)
authRouter.post('/password-recovery',limitIp,validationPasswordRecovery,authController.passwordRecovery)
authRouter.post('/new-password',limitIp,sanitizationBodyNewPass,validationNewPassword,authController.newPassword)