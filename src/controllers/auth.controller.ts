import {Request, Response} from "express";
import {usersService} from "../domain/users.service";
import {jwtService} from "../application/jwt.service";
import {RequestWithBody, Statuses} from "../types/types";
import {LoginInputModel, LoginSuccessViewModel} from "../types/auth";
import {usersQueryRepository} from "../repositories/query/usersQuery";

export const login = async (req:RequestWithBody<LoginInputModel>,res:Response) => {
    const checkData = await usersService.checkCredentials(req.body.loginOrEmail,req.body.password);
    if(!checkData.user || !checkData.check){
        return res.sendStatus(Statuses.UN_AUTHORIZED)
    }
    const tokenData: LoginSuccessViewModel = await jwtService.createJWT(checkData.user);
    res.status(Statuses.OK).send(tokenData)
}

export const meProfile = async (req: Request, res: Response) => {
    const profile = await usersQueryRepository.getMeProfile(req.user!.id);
    res.status(Statuses.OK).send(profile)
}