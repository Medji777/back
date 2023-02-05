import {Request,Response,NextFunction} from "express";
import {config} from 'dotenv';
import {Statuses} from "../types/types";

config()

const authData = {login: process.env.BASIC_LOGIN, password: process.env.BASIC_PASS} as const

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