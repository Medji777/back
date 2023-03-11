import {UserModel} from "./users";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserModel | null,
            deviceId: string | null
        }
    }
}