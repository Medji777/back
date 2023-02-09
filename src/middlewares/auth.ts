import {Request,Response,NextFunction} from "express";
import {settings} from "../settings";
import {Statuses} from "../types/types";
import {jwtService} from "../application/jwt.service";
import {usersQueryRepository} from "../repositories/query/usersQuery";

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
        const userId = await jwtService.getUserIdByToken(bearerToken);
        if(name === 'Bearer' && userId){
            req.user = await usersQueryRepository.getUserByUserId(userId)
            return next()
        }
    }
    return res.sendStatus(Statuses.UN_AUTHORIZED)
}