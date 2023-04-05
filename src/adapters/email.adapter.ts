import {injectable} from "inversify";
import nodemailer from "nodemailer"
import {settings} from "../settings"

type EmailBody = {
    email: string,
    subject: string,
    message: string
}

@injectable()
export class EmailAdapter {
    async send(payload: EmailBody){
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: settings.EMAIL_USER,
                pass: settings.EMAIL_PASS
            }
        });

        return transport.sendMail({
            from: `Vladimir <${settings.EMAIL_USER}>`,
            to: payload.email,
            subject: payload.subject,
            html: payload.message
        })
    }
}