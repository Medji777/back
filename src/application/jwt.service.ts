import jwt from "jsonwebtoken"
import {settings} from "../settings";
import {UserModel} from "../types/users";
import {LoginSuccessViewModel, RefreshTypeModel} from "../types/auth";

type UserId = {
    userId: string
}

export const jwtService = {
    async createAccessToken(user: UserModel): Promise<LoginSuccessViewModel>{
        const accessToken = jwt.sign({userId: user.id},settings.JWT_SECRET,{expiresIn: '10s'});
        return {accessToken}
    },
    async createRefreshToken(user: UserModel): Promise<RefreshTypeModel>{
        const refreshToken = jwt.sign({userId: user.id},settings.JWT_REFRESH_SECRET,{expiresIn: '1h'});
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
    }
}