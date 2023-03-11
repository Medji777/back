import {sessionsCollection} from "../db";
import {DeviceModel} from "../../types/security";

export const securityQueryRepository = {
    async getAllActiveSessions(userId: string): Promise<Array<DeviceModel>>{
        return sessionsCollection
            .find({userId},{projection: {_id:0}})
            .toArray()
    },
    async findSession(userId: string, deviceId: string): Promise<DeviceModel | null>{
        return sessionsCollection.findOne({userId,deviceId},{projection: {_id:0}})
    }
}