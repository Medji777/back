import {EmailConfirmUserModel, PasswordConfirmUserModel, UserInputModel, UserViewModel} from "../types/users";
import {usersService} from "./users.service";
import {emailManager} from "../managers/email.manager";
import {randomUUID as uuidV4} from "crypto";
import add from "date-fns/add";
import bcrypt from "bcrypt";
import {usersRepository} from "../repositories";
import {NewPasswordRecoveryInputModel, RegistrationConfirmationCodeModel} from "../types/auth";
import {usersQueryRepository} from "../repositories/query/usersQuery";

class AuthService {
    async saveUser(payload: UserInputModel): Promise<UserViewModel | null>{
        const passwordHash = await this._createPasswordHash(payload.password);
        const emailConfirmation = this._createConfirmation();
        const date = new Date();
        const newUser = {
            id: `${+date}`,
            login: payload.login,
            email: payload.email,
            createdAt: date.toISOString(),
            passwordHash,
            emailConfirmation,
            passwordConfirmation: {
                confirmationCode: null,
                isConfirmed: true
            }
        }
        await usersRepository.create(newUser)
        try {
            await emailManager.sendCodeConfirmationMessage(newUser, 'confirm-email')
        }
        catch (err) {
            console.log(err)
            await usersService.deleteUser(newUser.id)
            return null
        }
        return newUser
    }
    async confirmUser(payload: RegistrationConfirmationCodeModel): Promise<boolean>{
        const user = await usersQueryRepository.getUserByCode(payload.code);
        return usersRepository.updateConfirmation(user!.id)
    }
    async resendingCode(email: string): Promise<boolean>{
        const emailConfirmation = this._createConfirmation();
        const result = await usersRepository.updateConfirmationData(email,emailConfirmation)
        try {
            await emailManager.sendCodeConfirmationMessage({email, emailConfirmation}, 'confirm-registration')
        }
        catch (err) {
            console.log(err)
            return false
        }
        return result
    }
    async recoveryPassword(email: string): Promise<boolean>{
        const passwordConfirmation = this._createConfirmation();
        const result = await usersRepository.updatePasswordConfirmationData(email, passwordConfirmation)
        try {
            await emailManager.sendRecoveryCodeConfirmationMessage({email, passwordConfirmation},'password-recovery')
        }
        catch (err) {
            console.log(err)
            return false
        }
        return result
    }
    async confirmRecoveryPassword(payload: NewPasswordRecoveryInputModel){
        const passwordHash = await this._createPasswordHash(payload.newPassword);
        return usersRepository.updatePassword(payload.recoveryCode,{passwordHash})
    }
    private _createConfirmation(): EmailConfirmUserModel | PasswordConfirmUserModel {
        return ({
            confirmationCode: uuidV4(),
            expirationDate: add(new Date(),{
                hours: 1,
                minutes: 5
            }),
            isConfirmed: false
        })
    }
    private async _createPasswordHash(password: string){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }
}

export const authService = new AuthService()