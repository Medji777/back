import {SessionsModel} from "../db";
import {DeviceModel,DeviceViewModel} from "../../types/security";

export const securityQueryRepository = {
    async getAllActiveSessions(userId: string): Promise<Array<DeviceViewModel>>{
        return SessionsModel
            .find({userId},{_id:0, expiredTokenDate: 0, userId: 0,__v:0})
            .lean()
    },
    async findSession(userId: string, deviceId: string): Promise<DeviceModel | null>{
        return SessionsModel.findOne({userId,deviceId},{_id:0,__v:0}).lean()
    },
    async checkSessionByDeviceId(deviceId: string): Promise<boolean>{
        const count = await SessionsModel.countDocuments({deviceId})
        return !!count
    }
}