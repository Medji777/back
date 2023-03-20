export type LoginInputModel = {
    loginOrEmail: string,
    password: string,
}

export type LoginSuccessViewModel = {
    accessToken: string
}

export type RefreshTypeModel = {
    refreshToken: string
}

export type RegistrationConfirmationCodeModel = {
    code: string
}

export type RegistrationEmailResending = {
    email: string
}

export type PasswordRecoveryInputModel = RegistrationEmailResending

export type NewPasswordRecoveryInputModel = {
    newPassword: string,
    recoveryCode: string
}