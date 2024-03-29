import {injectable} from "inversify";
import {SessionsModel} from "../domain";
import {DeviceModel, DeviceViewModel} from "../types/security";

@injectable()
export class SecurityRepository {
    async createSession(payload: DeviceModel): Promise<DeviceViewModel>{
        await SessionsModel.create({...payload});
        return {
            title: payload.title,
            deviceId: payload.deviceId,
            ip: payload.ip,
            lastActiveDate: payload.lastActiveDate
        }
    }
    async updateLastActiveDataSession(userId: string, deviceId: string, issueAt: string): Promise<boolean> {
        const result = await SessionsModel.updateOne({userId,deviceId},{$set:{lastActiveDate: issueAt}})
        return result.matchedCount === 1
    }
    async deleteAllSessionsWithoutCurrent(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionsModel.deleteMany({userId, deviceId: {$nin: [deviceId]}})
        return !!result.deletedCount
    }
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await SessionsModel.deleteOne({deviceId})
        return result.deletedCount === 1
    }
}