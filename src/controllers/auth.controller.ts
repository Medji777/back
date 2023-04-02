import {Request, Response} from "express";
import {usersService} from "../domain/users.service";
import {jwtService} from "../application/jwt.service";
import {RequestWithBody, Statuses} from "../types/types";
import {
    LoginInputModel,
    LoginSuccessViewModel,
    NewPasswordRecoveryInputModel,
    PasswordRecoveryInputModel,
    RefreshTypeModel,
    RegistrationConfirmationCodeModel,
    RegistrationEmailResending
} from "../types/auth";
import {authService} from "../domain/auth.service";
import {UserInputModel} from "../types/users";
import {securityService} from "../domain/security.service";
import {randomUUID} from "crypto";
import {usersQueryRepository} from "../repositories/query/usersQuery";

class AuthController {
    async login(req:RequestWithBody<LoginInputModel>,res:Response){
        const checkData = await usersService.checkCredentials(req.body.loginOrEmail,req.body.password);
        if(!checkData.user || !checkData.check){
            return res.sendStatus(Statuses.UN_AUTHORIZED)
        }
        if(!checkData.user.emailConfirmation.isConfirmed){
            return res.sendStatus(Statuses.UN_AUTHORIZED)
        }
        const deviceId = randomUUID();
        const accessTokenData: LoginSuccessViewModel = await jwtService.createAccessToken(checkData.user);
        const refreshTokenData: RefreshTypeModel = await jwtService.createRefreshToken(checkData.user,deviceId);

        const deviceName = req.headers?.["user-agent"] || 'device';
        await securityService.createSession(refreshTokenData.refreshToken,deviceName,req.ip);

        res
            .cookie('refreshToken',refreshTokenData.refreshToken,{
                httpOnly: true,
                secure: true
            })
            .status(Statuses.OK).send(accessTokenData)
    }
    async logout(req: Request, res: Response){
        const isDeleted = await securityService.deleteSessionByDeviceId(req.deviceId!)
        if (!isDeleted) {
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.clearCookie('refreshToken').sendStatus(Statuses.NO_CONTENT)
    }
    async meProfile(req: Request, res: Response){
        const profile = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        }
        res.status(Statuses.OK).send(profile)
    }
    async registration(req: RequestWithBody<UserInputModel>,res: Response){
        await authService.saveUser(req.body)
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async confirmation(req: RequestWithBody<RegistrationConfirmationCodeModel>,res: Response){
        const isConfirmed = await authService.confirmUser(req.body)
        if(!isConfirmed){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async emailResending(req: RequestWithBody<RegistrationEmailResending>,res: Response){
        const isResend = await authService.resendingCode(req.body.email)
        if(!isResend){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async passwordRecovery(req: RequestWithBody<PasswordRecoveryInputModel>,res: Response){
        const user = await usersQueryRepository.getUserByLoginOrEmail(req.body.email);
        if(!user){
            return res.sendStatus(Statuses.NO_CONTENT)
        }
        const isSend = await authService.recoveryPassword(req.body.email)
        if(!isSend){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async newPassword(req: RequestWithBody<NewPasswordRecoveryInputModel>,res: Response){
        const isUpdated = await authService.confirmRecoveryPassword(req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async refreshToken(req: Request, res: Response){
        const deviceId = req.deviceId!;
        const accessTokenData: LoginSuccessViewModel = await jwtService.createAccessToken(req.user!);
        const refreshTokenData: RefreshTypeModel = await jwtService.createRefreshToken(req.user!,deviceId);
        const isUpdated = await securityService.updateLastActiveDataSession(refreshTokenData.refreshToken);
        if(!isUpdated){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res
            .cookie('refreshToken',refreshTokenData.refreshToken,{
                httpOnly: true,
                secure: true
            })
            .status(Statuses.OK).send(accessTokenData)
    }
}

export const authController = new AuthController()