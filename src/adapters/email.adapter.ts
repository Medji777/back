import nodemailer from "nodemailer"
import {settings} from "../settings"

type EmailBody = {
    email: string,
    subject: string,
    message: string
}

export const emailAdapter = {
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