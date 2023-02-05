import {usersCollection} from "./db";
import {UserViewModel,UserModel} from "../types/users";

export const usersRepository = {
    async create(payload: UserModel): Promise<UserViewModel>{
        await usersCollection.insertOne({...payload})
        return {
            id: payload.id,
            login: payload.login,
            email: payload.email,
            createdAt: payload.createdAt
        }
    },
    async deleteById(id: string): Promise<boolean>{
        const result = await usersCollection.deleteOne({id});
        return result.deletedCount === 1
    }
}