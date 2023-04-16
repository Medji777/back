import {model, Schema} from "mongoose";
import {UserModel} from "../types/users";

const emailConfirmationSchema = {
    confirmationCode: String || null,
    expirationDate: Date,
    isConfirmed: {type: Boolean, required: true}
}

const passwordConfirmationSchema = {
    confirmationCode: String || null,
    expirationDate: Date,
    isConfirmed: {type: Boolean, required: true}
}

const usersSchema = new Schema({
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: String,
    passwordHash: {type: String, required: true},
    emailConfirmation: emailConfirmationSchema,
    passwordConfirmation: passwordConfirmationSchema
})

usersSchema.statics.makeInstance = function () {

}

export const UsersModel = model<UserModel>('users', usersSchema);