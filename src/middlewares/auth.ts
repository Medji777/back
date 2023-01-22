import {Request,Response,NextFunction} from "express";
import {Statuses} from "../types/types";

const authData = {login: 'admin', password: 'qwerty'} as const

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