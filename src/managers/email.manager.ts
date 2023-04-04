import {EmailConfirmUserDataModel, PasswordConfirmUserDataModel, UserModel} from "../types/users";
import {emailAdapter} from "../adapters/email.adapter";
import {settings} from "../settings";

export class EmailManager {
    async sendCodeConfirmationMessage(user: UserModel | EmailConfirmUserDataModel & {email: string}, action: string): Promise<void>{
        const code = user.emailConfirmation.confirmationCode
        await emailAdapter.send({
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
        await emailAdapter.send({
            email: user.email,
            subject: 'confirmation code',
            message: '<h1>Password recovery</h1>\n' +
                '       <p>To finish password recovery please follow the link below:\n' +
                '          <a href=\'https://'+ settings.EMAIL_BASE_URI + '/' + action + '?recoveryCode=' + code +'\'>recovery password</a>\n' +
                '      </p>'
        })
    }
}