export type UserInputModel = {
    login: string,
    password: string,
    email: string
}

export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt?: string
}

export type MeViewModel = {
    login: string,
    email: string,
    userId: string
}

export type PasswordHash = {
    passwordHash: string
}

export type UserModel = UserViewModel & PasswordHash & EmailConfirmUserDataModel & PasswordConfirmUserDataModel;

export type EmailConfirmUserDataModel = {
    emailConfirmation: EmailConfirmUserModel,
}

export type EmailConfirmUserModel = {
    confirmationCode?: string | null,
    expirationDate?: Date,
    isConfirmed: boolean
}

export type PasswordConfirmUserDataModel = {
    passwordConfirmation: PasswordConfirmUserModel,
}

export type PasswordConfirmUserModel = EmailConfirmUserModel