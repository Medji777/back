import {Request, Response} from "express";
import {usersService} from "../domain/users.service";
import {jwtService} from "../application/jwt.service";
import {RequestWithBody, Statuses} from "../types/types";
import {
    LoginInputModel,
    LoginSuccessViewModel, RefreshTypeModel,
    RegistrationConfirmationCodeModel,
    RegistrationEmailResending
} from "../types/auth";
// import {usersQueryRepository} from "../repositories/query/usersQuery";
import {authService} from "../domain/auth.service";
import {UserInputModel} from "../types/users";
import {tokensService} from "../domain/tokens.service";

export const login = async (req:RequestWithBody<LoginInputModel>,res:Response) => {
    const checkData = await usersService.checkCredentials(req.body.loginOrEmail,req.body.password);
    if(!checkData.user || !checkData.check){
        return res.sendStatus(Statuses.UN_AUTHORIZED)
    }
    if(!checkData.user.emailConfirmation.isConfirmed){
        return res.sendStatus(Statuses.UN_AUTHORIZED)
    }
    const accessTokenData: LoginSuccessViewModel = await jwtService.createAccessToken(checkData.user);
    const refreshTokenData: RefreshTypeModel = await jwtService.createRefreshToken(checkData.user);
    res
        .cookie('refreshToken',refreshTokenData.refreshToken,{
            httpOnly: true,
            secure: true
        })
        .status(Statuses.OK).send(accessTokenData)
}

export const refreshToken = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const accessTokenData: LoginSuccessViewModel = await jwtService.createAccessToken(req.user!);
    const refreshTokenData: RefreshTypeModel = await jwtService.createRefreshToken(req.user!);
    const isUpdated = await tokensService.update(refreshTokenData.refreshToken,userId);
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

export const logout = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const isDeleted = await tokensService.delete(userId);
    if (!isDeleted) {
        return res.sendStatus(Statuses.BAD_REQUEST)
    }
    res.clearCookie('refreshToken').sendStatus(Statuses.NO_CONTENT)
}

export const meProfile = async (req: Request, res: Response) => {
    //const profile = await usersQueryRepository.getMeProfile(req.user!.id);
    const profile = {
        email: req.user!.email,
        login: req.user!.login,
        userId: req.user!.id
    }
    res.status(Statuses.OK).send(profile)
}

export const registration = async (
    req: RequestWithBody<UserInputModel>,
    res: Response) => {
    await authService.saveUser(req.body)
    res.sendStatus(Statuses.NO_CONTENT)
}

export const confirmation = async (
    req: RequestWithBody<RegistrationConfirmationCodeModel>,
    res: Response) => {
    const isConfirmed = await authService.confirmUser(req.body)
    if(!isConfirmed){
        return res.sendStatus(Statuses.BAD_REQUEST)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const emailResending = async (
    req: RequestWithBody<RegistrationEmailResending>,
    res: Response) => {
    const isResend = await authService.resendingCode(req.body.email)
    if(!isResend){
        return res.sendStatus(Statuses.BAD_REQUEST)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}