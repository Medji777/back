import jwt from "jsonwebtoken"
import {settings} from "../settings";
import {UserModel} from "../types/users";
import {LoginSuccessViewModel} from "../types/auth";

export const jwtService = {
    async createJWT(user: UserModel): Promise<LoginSuccessViewModel>{
        const token = jwt.sign({userId: user.id},settings.JWT_SECRET,{expiresIn: '1h'});
        return {
            accessToken: token
        }
    },
    async getUserIdByToken(token: string): Promise<string | null>{
        try {
            const result: any = jwt.verify(token,settings.JWT_SECRET);
            return result.userId
        }
        catch (err) {
            return null
        }
    }
}