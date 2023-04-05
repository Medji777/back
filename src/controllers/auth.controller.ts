import {Request, Response} from "express";
import {randomUUID} from "crypto";
import {inject, injectable} from "inversify";
import {JwtService} from "../application/jwt.service";
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
import {UserInputModel} from "../types/users";
import {UsersQueryRepository} from "../repositories/query";
import {AuthService, SecurityService, UsersService} from "../domain";

@injectable()
export class AuthController {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(SecurityService) protected securityService: SecurityService,
        @inject(AuthService) protected authService: AuthService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}
    async login(req:RequestWithBody<LoginInputModel>,res:Response){
        const checkData = await this.usersService.checkCredentials(req.body.loginOrEmail,req.body.password);
        if(!checkData.user || !checkData.check){
            return res.sendStatus(Statuses.UN_AUTHORIZED)
        }
        if(!checkData.user.emailConfirmation.isConfirmed){
            return res.sendStatus(Statuses.UN_AUTHORIZED)
        }
        const deviceId = randomUUID();
        const accessTokenData: LoginSuccessViewModel = await this.jwtService.createAccessToken(checkData.user);
        const refreshTokenData: RefreshTypeModel = await this.jwtService.createRefreshToken(checkData.user,deviceId);

        const deviceName = req.headers?.["user-agent"] || 'device';
        await this.securityService.createSession(refreshTokenData.refreshToken,deviceName,req.ip);

        res
            .cookie('refreshToken',refreshTokenData.refreshToken,{
                httpOnly: true,
                secure: true
            })
            .status(Statuses.OK).send(accessTokenData)
    }
    async logout(req: Request, res: Response){
        const isDeleted = await this.securityService.deleteSessionByDeviceId(req.deviceId!)
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
        await this.authService.saveUser(req.body)
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async confirmation(req: RequestWithBody<RegistrationConfirmationCodeModel>,res: Response){
        const isConfirmed = await this.authService.confirmUser(req.body)
        if(!isConfirmed){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async emailResending(req: RequestWithBody<RegistrationEmailResending>,res: Response){
        const isResend = await this.authService.resendingCode(req.body.email)
        if(!isResend){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async passwordRecovery(req: RequestWithBody<PasswordRecoveryInputModel>,res: Response){
        const user = await this.usersQueryRepository.getUserByLoginOrEmail(req.body.email);
        if(!user){
            return res.sendStatus(Statuses.NO_CONTENT)
        }
        const isSend = await this.authService.recoveryPassword(req.body.email)
        if(!isSend){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async newPassword(req: RequestWithBody<NewPasswordRecoveryInputModel>,res: Response){
        const isUpdated = await this.authService.confirmRecoveryPassword(req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async refreshToken(req: Request, res: Response){
        const deviceId = req.deviceId!;
        const accessTokenData: LoginSuccessViewModel = await this.jwtService.createAccessToken(req.user!);
        const refreshTokenData: RefreshTypeModel = await this.jwtService.createRefreshToken(req.user!,deviceId);
        const isUpdated = await this.securityService.updateLastActiveDataSession(refreshTokenData.refreshToken);
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