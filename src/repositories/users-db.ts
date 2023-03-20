import {usersCollection} from "./db";
import {
    UserViewModel,
    UserModel,
    EmailConfirmUserModel,
    PasswordConfirmUserModel, PasswordHash
} from "../types/users";

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
    async updateConfirmation(id: string) {
        const result = await usersCollection.updateOne(
            {id},
            {$set: {'emailConfirmation.isConfirmed': true}}
        );
        return result.modifiedCount === 1
    },
    async updateConfirmationData(email: string, payload: EmailConfirmUserModel) {
        const result = await usersCollection.updateOne(
            {email},
            {$set:{emailConfirmation: payload}}
        )
        return result.modifiedCount === 1
    },
    async updatePasswordConfirmationData(email: string, payload: PasswordConfirmUserModel) {
        const result = await usersCollection.updateOne(
            {email},
            {$set:{passwordConfirmation: payload}}
        )
        return result.modifiedCount === 1
    },
    async updatePassword(code: string,payload: PasswordHash){
        const result = await usersCollection.updateOne(
            {'passwordConfirmation.confirmationCode': code},
            {$set:{...payload}})
        return result.modifiedCount === 1
    },
    async deleteById(id: string): Promise<boolean>{
        const result = await usersCollection.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await usersCollection.deleteMany({})
    }
}