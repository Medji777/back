import {tokensRepository} from "../repositories/tokens-db";
import {jwtService} from "../application/jwt.service";
import {settings} from "../settings";
import {tokensQueryRepository} from "../repositories/query/tokensQuery";

export const tokensService = {
    async create(token: string, userId: string){
        return tokensRepository.create({
            userId,
            token
        })
    },
    async update(token: string, userId: string){
        return tokensRepository.update(userId,token)
    },
    async delete(userId: string){
        return tokensRepository.delete(userId)
    },
    async deleteAllById(userId: string){
      return tokensRepository.deleteAllById(userId)
    },
    async checkRefreshToken(token: string): Promise<string | null>{
        const userId = await jwtService.getUserIdByToken(token, settings.JWT_REFRESH_SECRET);
        if(userId){
            const data = await tokensQueryRepository.findById(userId);
            if(data && token === data.token){
                return userId
            }
        }
        return null
    }
}