import {config} from 'dotenv';

config()

export const settings = {
    BASIC_LOGIN: process.env.BASIC_LOGIN,
    BASIC_PASS: process.env.BASIC_PASS,
    mongoURI: process.env.mongoURI || "mongodb://0.0.0.0:27017",
    PORT: process.env.PORT || "3000",
    JWT_SECRET: process.env.SECRET || "123",
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS
}