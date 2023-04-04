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

authRouter.post('/login',
    limitIp,
    sanitizationBodyLogin,
    validateBodyLogin,authController.login.bind(authController)
)
authRouter.post('/refresh-token',checkRefreshTokenMiddleware,authController.refreshToken.bind(authController))
authRouter.post('/logout',checkRefreshTokenMiddleware,authController.logout.bind(authController))
authRouter.get('/me',authMiddleware,authController.meProfile.bind(authController))
authRouter.post(
    '/registration',
    limitIp,
    sanitizationBodyReg,
    validateBodyReg,
    validateExistUserOnEmailOrLogin,
    authController.registration.bind(authController))
authRouter.post('/registration-confirmation',
    limitIp,
    validationConfirmation,
    authController.confirmation.bind(authController)
)
authRouter.post('/registration-email-resending',
    limitIp,
    validationConfirmed,
    authController.emailResending.bind(authController)
)
authRouter.post('/password-recovery',
    limitIp,
    validationPasswordRecovery,
    authController.passwordRecovery.bind(authController)
)
authRouter.post('/new-password',
    limitIp,
    sanitizationBodyNewPass,
    validationNewPassword,
    authController.newPassword.bind(authController)
)