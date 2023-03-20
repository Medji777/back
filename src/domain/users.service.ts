import bcrypt from "bcrypt"
import {UserInputModel, UserModel, UserViewModel} from "../types/users";
import {usersRepository} from "../repositories";
import {usersQueryRepository} from "../repositories/query/usersQuery";

type Cred = {
    check: boolean,
    user: UserModel | null
}

export const usersService = {
    async createUser(payload: UserInputModel): Promise<UserViewModel>{
        const passwordHash = await this._createPasswordHash(payload.password);
        const date = new Date();
        const newUser = {
            id: `${+date}`,
            login: payload.login,
            email: payload.email,
            createdAt: date.toISOString(),
            passwordHash,
            emailConfirmation: {
                confirmationCode: null,
                isConfirmed: true
            },
            passwordConfirmation: {
                confirmationCode: null,
                isConfirmed: true
            }
        }
        return usersRepository.create(newUser)
    },
    async deleteUser(id: string): Promise<boolean>{
        return usersRepository.deleteById(id)
    },
    async checkCredentials(input: string, password: string): Promise<Cred>{
        const user = await usersQueryRepository.getUserByLoginOrEmail(input)
        if(!user) {
            return {
                check: false,
                user: null
            }
        } else {
            const check = await bcrypt.compare(password,user.passwordHash)
            return {
                check,
                user
            }
        }
    },
    async _createPasswordHash(password: string){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    },
}