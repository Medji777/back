import {tokensCollection} from "./db";
import {TokensModel} from "../types/tokens";

export const tokensRepository = {
    async create(payload: TokensModel): Promise<TokensModel>{
        await tokensCollection.insertOne({...payload});
        return {
            userId: payload.userId,
            token: payload.token
        }
    },
    async update(userId:string,token:string): Promise<boolean>{
        const res = await tokensCollection.updateOne({userId},{$set:{token}});
        return res.modifiedCount === 1
    },
    async delete(userId:string): Promise<boolean>{
        const res = await tokensCollection.deleteOne({userId})
        return res.deletedCount === 1
    },
    async deleteAllById(userId:string): Promise<boolean>{
        const res = await tokensCollection.deleteMany({userId})
        return !!res.deletedCount
    },
    async deleteAll(): Promise<void>{
        await tokensCollection.deleteMany({})
    }
}