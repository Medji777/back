import {sessionsCollection} from "./db";
import {DeviceModel, DeviceViewModel} from "../types/security";

export const securityRepository = {
    async createSession(payload: DeviceModel): Promise<DeviceViewModel>{
        await sessionsCollection.insertOne({...payload});
        return {
            title: payload.title,
            deviceId: payload.deviceId,
            ip: payload.ip,
            lastActiveDate: payload.lastActiveDate
        }
    },
    async updateLastActiveDataSession(userId: string, deviceId: string, issueAt: string): Promise<boolean> {
        const result = await sessionsCollection.updateOne({userId,deviceId},{$set:{lastActiveDate: issueAt}})
        return result.matchedCount === 1
    },
    async deleteAllSessionsWithoutCurrent(userId: string, deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteMany({userId, deviceId: {$nin: [deviceId]}})
        return !!result.deletedCount
    },
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({deviceId})
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await sessionsCollection.deleteMany({})
    }
}