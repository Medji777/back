import {Request,Response,NextFunction} from "express";

const authData = {login: 'admin', password: 'qwerty'} as const

export const basicAuthMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const auth = req.headers['authorization'];
    if(auth){
        const basicBase64 = auth.split(' ')[1]
        const [login, password] = Buffer.from(basicBase64, 'base64').toString().split(':')
        if(login && password && login === authData.login && password === authData.password){
            return next()
        }
    }
    return res.sendStatus(401)
}