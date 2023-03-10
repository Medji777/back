import {sessionsCollection} from "../db";
import {DeviceModel,DeviceViewModel} from "../../types/security";

export const securityQueryRepository = {
    async getAllActiveSessions(userId: string): Promise<Array<DeviceViewModel>>{
        return sessionsCollection
            .find({userId},{projection: {_id:0, expiredTokenDate: 0, userId: 0}})
            .toArray()
    },
    async findSession(userId: string, deviceId: string): Promise<DeviceModel | null>{
        return sessionsCollection.findOne({userId,deviceId},{projection: {_id:0}})
    },
    async checkSessionByDeviceId(deviceId: string): Promise<boolean>{
        const count = await sessionsCollection.countDocuments({deviceId})
        return !!count
    }
}