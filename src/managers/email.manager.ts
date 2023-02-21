import {EmailConfirmUserDataModel, UserModel} from "../types/users";
import {emailAdapter} from "../adapters/email.adapter";
import {settings} from "../settings";

export const emailManager = {
    async sendCodeConfirmationMessage(user: UserModel | EmailConfirmUserDataModel & {email: string}){
        const code = user.emailConfirmation.confirmationCode
        await emailAdapter.send({
            email: user.email,
            subject: 'confirmation code',
            message: '<h1>Thank for your registration</h1>\n' +
                '       <p>To finish registration please follow the link below:\n' +
                '          <a href=\'https://'+ settings.EMAIL_BASE_URI +'/registration-confirmation?code=' + code +'\'>complete registration</a>\n' +
                '      </p>'
        })
    },

}