import {Request, Response} from "express";
import {usersService} from "../domain/users.service";
import {jwtService} from "../application/jwt.service";
import {RequestWithBody, RequestWithQuery, Statuses} from "../types/types";
import {
    LoginInputModel,
    LoginSuccessViewModel,
    RegistrationConfirmationCodeModel,
    RegistrationEmailResending
} from "../types/auth";
import {usersQueryRepository} from "../repositories/query/usersQuery";
import {authService} from "../domain/auth.service";
import {UserInputModel} from "../types/users";

export const login = async (req:RequestWithBody<LoginInputModel>,res:Response) => {
    const checkData = await usersService.checkCredentials(req.body.loginOrEmail,req.body.password);
    if(!checkData.user || !checkData.check){
        return res.sendStatus(Statuses.UN_AUTHORIZED)
    }
    if(!checkData.user.emailConfirmation.isConfirmed){
        return res.sendStatus(Statuses.UN_AUTHORIZED)
    }
    const tokenData: LoginSuccessViewModel = await jwtService.createJWT(checkData.user);
    res.status(Statuses.OK).send(tokenData)
}

export const meProfile = async (req: Request, res: Response) => {
    const profile = await usersQueryRepository.getMeProfile(req.user!.id);
    res.status(Statuses.OK).send(profile)
}

export const registration = async (
    req: RequestWithBody<UserInputModel>,
    res: Response) => {
    await authService.saveUser(req.body)
    res.sendStatus(Statuses.NO_CONTENT)
}

export const confirmation = async (
    req: RequestWithQuery<RegistrationConfirmationCodeModel>,
    res: Response) => {
    const isConfirmed = await authService.confirmUser(req.query)
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