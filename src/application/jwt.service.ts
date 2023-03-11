import jwt, {JwtPayload} from "jsonwebtoken";
import {settings} from "../settings";
import {UserModel} from "../types/users";
import {LoginSuccessViewModel, RefreshTypeModel} from "../types/auth";

type UserId = {
    userId: string
}

type JWTResponse = {
    expiredTokenDate: string,
    lastActiveTokenDate: string,
    [key: string]: any;
}

export const jwtService = {
    async createAccessToken(user: UserModel): Promise<LoginSuccessViewModel>{
        const accessToken = jwt.sign({userId: user.id},settings.JWT_SECRET,{expiresIn: '1h'});
        return {accessToken}
    },
    async createRefreshToken(user: UserModel, deviceId: string): Promise<RefreshTypeModel>{
        const refreshToken = jwt.sign(
            {userId: user.id, deviceId},
            settings.JWT_REFRESH_SECRET,
            {expiresIn: '20s'}
        );
        return {refreshToken}
    },
    async getUserIdByToken(token: string, secret: string): Promise<string | null>{
        try {
            const result = jwt.verify(token, secret) as UserId;
            return result.userId
        }
        catch (err) {
            return null
        }
    },
    async getJWTData<T>(token: string, secret: string): Promise<JWTResponse & T | null>{
        try {
            const {iat,exp,...rest}: any = await jwt.verify(token, secret) as JwtPayload;
            return {
                lastActiveTokenDate: new Date(iat * 1000).toISOString(),
                expiredTokenDate: new Date(exp * 1000).toISOString(),
                ...rest
            }
        }
        catch (err) {
            return null
        }
    },
}