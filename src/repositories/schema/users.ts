import {Schema} from "mongoose";

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

export default usersSchema