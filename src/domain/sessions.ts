import {model, Schema} from "mongoose";
import {DeviceModel} from "../types/security";

const sessionsSchema = new Schema({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    expiredTokenDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
})

export const SessionsModel = model<DeviceModel>('sessions', sessionsSchema);