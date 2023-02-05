import bcrypt from "bcrypt"
import {UserInputModel, UserViewModel} from "../types/users";
import {usersRepository} from "../repositories";
import {usersQueryRepository} from "../repositories/query/usersQuery";

export const usersService = {
    async createUser(payload: UserInputModel): Promise<UserViewModel>{
        const passwordHash = await this._createPasswordHash(payload.password);
        const date = new Date();
        const newUser = {
            id: `${+date}`,
            login: payload.login,
            email: payload.email,
            createdAt: date.toISOString(),
            passwordHash
        }
        return usersRepository.create(newUser)
    },
    async deleteUser(id: string): Promise<boolean>{
        return usersRepository.deleteById(id)
    },
    async checkCredentials(input: string, password: string){
        const user = await usersQueryRepository.getUserByLoginOrEmail(input)
        if(!user) return false;
        return bcrypt.compare(password,user.passwordHash)
    },
    async _createPasswordHash(password: string){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }
}