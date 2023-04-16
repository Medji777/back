import {inject, injectable} from "inversify";
import {randomUUID as uuidV4} from "crypto";
import add from "date-fns/add";
import bcrypt from "bcrypt";
import {EmailConfirmUserModel, PasswordConfirmUserModel, UserInputModel, UserViewModel} from "../types/users";
import {UsersService} from "./users.service";
import {EmailManager} from "../managers/email.manager";
import {NewPasswordRecoveryInputModel, RegistrationConfirmationCodeModel} from "../types/auth";
import {UsersQueryRepository} from "../repositories/query";

@injectable()
export class AuthService {
    constructor(
        @inject(EmailManager) protected emailManager: EmailManager,
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {}
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
        await this.usersService.create(newUser)
        try {
            await this.emailManager.sendCodeConfirmationMessage(newUser, 'confirm-email')
        }
        catch (err) {
            console.log(err)
            await this.usersService.deleteUser(newUser.id)
            return null
        }
        return newUser
    }
    async confirmUser(payload: RegistrationConfirmationCodeModel): Promise<boolean>{
        const user = await this.usersQueryRepository.getUserByCode(payload.code);
        return this.usersService.updateConfirmation(user!.id)
    }
    async resendingCode(email: string): Promise<boolean>{
        const emailConfirmation = this._createConfirmation();
        const result = await this.usersService.updateConfirmationData(email,emailConfirmation)
        try {
            await this.emailManager.sendCodeConfirmationMessage({email, emailConfirmation}, 'confirm-registration')
        }
        catch (err) {
            console.log(err)
            return false
        }
        return result
    }
    async recoveryPassword(email: string): Promise<boolean>{
        const passwordConfirmation = this._createConfirmation();
        const result = await this.usersService.updatePasswordConfirmationData(email, passwordConfirmation)
        try {
            await this.emailManager.sendRecoveryCodeConfirmationMessage({email, passwordConfirmation},'password-recovery')
        }
        catch (err) {
            console.log(err)
            return false
        }
        return result
    }
    async confirmRecoveryPassword(payload: NewPasswordRecoveryInputModel){
        const passwordHash = await this._createPasswordHash(payload.newPassword);
        return this.usersService.updatePassword(payload.recoveryCode,{passwordHash})
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