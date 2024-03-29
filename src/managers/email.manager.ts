import {inject, injectable} from "inversify";
import {EmailConfirmUserDataModel, PasswordConfirmUserDataModel, UserModel} from "../types/users";
import {EmailAdapter} from "../adapters/email.adapter";
import {settings} from "../settings";

@injectable()
export class EmailManager {
    constructor(@inject(EmailAdapter) protected emailAdapter: EmailAdapter) {}
    async sendCodeConfirmationMessage(user: UserModel | EmailConfirmUserDataModel & {email: string}, action: string): Promise<void>{
        const code = user.emailConfirmation.confirmationCode
        await this.emailAdapter.send({
            email: user.email,
            subject: 'confirmation code',
            message: '<h1>Thank for your registration</h1>\n' +
                '       <p>To finish registration please follow the link below:\n' +
                '          <a href=\'https://'+ settings.EMAIL_BASE_URI + '/' + action + '?code=' + code +'\'>complete registration</a>\n' +
                '      </p>'
        })
    }
    async sendRecoveryCodeConfirmationMessage(user: UserModel | PasswordConfirmUserDataModel & {email: string}, action: string): Promise<void>{
        const code = user.passwordConfirmation.confirmationCode
        await this.emailAdapter.send({
            email: user.email,
            subject: 'confirmation code',
            message: '<h1>Password recovery</h1>\n' +
                '       <p>To finish password recovery please follow the link below:\n' +
                '          <a href=\'https://'+ settings.EMAIL_BASE_URI + '/' + action + '?recoveryCode=' + code +'\'>recovery password</a>\n' +
                '      </p>'
        })
    }
}