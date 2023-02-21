import {EmailConfirmUserModel, UserInputModel, UserViewModel} from "../types/users";
import {usersService} from "./users.service";
import {emailManager} from "../managers/email.manager";
import {randomUUID as uuidV4} from "crypto";
import add from "date-fns/add";
import bcrypt from "bcrypt";
import {usersRepository} from "../repositories";
import {RegistrationConfirmationCodeModel} from "../types/auth";
import {usersQueryRepository} from "../repositories/query/usersQuery";

export const authService = {
    async saveUser(payload: UserInputModel): Promise<UserViewModel | null> {
        const passwordHash = await this._createPasswordHash(payload.password);
        const emailConfirmation = this._createEmailConfirmation();
        const date = new Date();
        const newUser = {
            id: `${+date}`,
            login: payload.login,
            email: payload.email,
            createdAt: date.toISOString(),
            passwordHash,
            emailConfirmation
        }
        await usersRepository.create(newUser)
        try {
            await emailManager.sendCodeConfirmationMessage(newUser)
        }
        catch (err) {
            console.log(err)
            await usersService.deleteUser(newUser.id)
            return null
        }
        return newUser
    },
    async confirmUser(payload: RegistrationConfirmationCodeModel): Promise<boolean> {
        const user = await usersQueryRepository.getUserByCode(payload.code);
        return usersRepository.updateConfirmation(user!.id)
    },
    async resendingCode(email: string): Promise<boolean> {
        const emailConfirmation = this._createEmailConfirmation();
        const result = await usersRepository.updateConfirmationData(email,emailConfirmation)
        try {
            await emailManager.sendCodeConfirmationMessage({email, emailConfirmation})
        }
        catch (err) {
            console.log(err)
            return false
        }
        return result
    },
    _createEmailConfirmation(): EmailConfirmUserModel {
        return ({
            confirmationCode: uuidV4(),
            expirationDate: add(new Date(),{
                hours: 1,
                minutes: 5
            }),
            isConfirmed: false
        })
    },
    async _createPasswordHash(password: string){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    },
}