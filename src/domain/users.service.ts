import bcrypt from "bcrypt"
import {
    EmailConfirmUserModel,
    PasswordConfirmUserModel,
    PasswordHash,
    UserInputModel,
    UserModel,
    UserViewModel
} from "../types/users";
import {UsersQueryRepository} from "../repositories/query";
import {UsersRepository} from "../repositories";

type Cred = {
    check: boolean,
    user: UserModel | null
}

export class UsersService {
    constructor(
        protected usersRepository: UsersRepository,
        protected usersQueryRepository: UsersQueryRepository
    ) {}
    async create(payload: UserModel): Promise<UserViewModel>{
        return this.usersRepository.create(payload)
    }
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
        return this.usersRepository.create(newUser)
    }
    async deleteUser(id: string): Promise<boolean>{
        return this.usersRepository.deleteById(id)
    }
    async checkCredentials(input: string, password: string): Promise<Cred>{
        const user = await this.usersQueryRepository.getUserByLoginOrEmail(input)
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
    }
    async updatePassword(code: string, payload: PasswordHash): Promise<boolean>{
        return this.usersRepository.updatePassword(code,payload)
    }
    async updatePasswordConfirmationData(email: string, payload: PasswordConfirmUserModel): Promise<boolean> {
        return this.usersRepository.updatePasswordConfirmationData(email,payload)
    }
    async updateConfirmation(id: string): Promise<boolean>{
        return this.usersRepository.updateConfirmation(id)
    }
    async updateConfirmationData(email: string, payload: EmailConfirmUserModel): Promise<boolean> {
        return this.usersRepository.updateConfirmationData(email,payload)
    }
    private async _createPasswordHash(password: string): Promise<string>{
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }
}