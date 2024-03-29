import {NextFunction, Request, Response} from "express";
import {settings} from "../settings";
import {Statuses} from "../types/types";
import {jwtService, securityService, usersQueryRepository} from "../composition-root";

const authData = {login: settings.BASIC_LOGIN, password: settings.BASIC_PASS} as const

export const basicAuthMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const auth = req.headers['authorization'];
    if(auth){
        const [name,basicBase64] = auth.split(' ')
        const [login, password] = Buffer.from(basicBase64, 'base64').toString().split(':')
        if(name === 'Basic' && login && password && login === authData.login && password === authData.password){
            return next()
        }
    }
    return res.sendStatus(Statuses.UN_AUTHORIZED)
}

export const bearerAuthMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const auth = req.headers['authorization'];
    if(auth){
        const [name,bearerToken] = auth.split(' ');
        const userId = await jwtService.getUserIdByToken(bearerToken, settings.JWT_SECRET);
        if(name === 'Bearer' && userId){
            req.user = await usersQueryRepository.getUserByUserId(userId)
            return next()
        }
    }
    return res.sendStatus(Statuses.UN_AUTHORIZED)
}

export const checkRefreshTokenMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const refresh = req.cookies?.refreshToken;
    if(refresh){
        const payload = await securityService.checkRefreshToken(refresh);
        if(payload?.userId && payload?.deviceId){
            req.user = await usersQueryRepository.getUserByUserId(payload.userId);
            req.deviceId = payload.deviceId
            return next()
        }
    }
    return res.sendStatus(Statuses.UN_AUTHORIZED)
}

export const getUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return next()
    }
    const [name,bearerToken] = auth.split(' ');
    const userId = await jwtService.getUserIdByToken(bearerToken, settings.JWT_SECRET)
    if(name === 'Bearer' && userId){
        req.user = await usersQueryRepository.getUserByUserId(userId)
        return next()
    }
    next()
}