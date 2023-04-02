import {securityRepository} from '../repositories'
import {jwtService} from "../application/jwt.service";
import {settings} from "../settings";
import {RefreshPayloadType} from "../types/tokens";
import {DeviceViewModel} from "../types/security";
import {securityQueryRepository} from "../repositories/query/securityQuery";
import {isEqual} from "date-fns";

class SecurityService {
    async createSession(refreshToken: string, title: string, ip: string): Promise<DeviceViewModel> {
        const meta = await jwtService.getJWTData<RefreshPayloadType>(refreshToken,settings.JWT_REFRESH_SECRET)
        return securityRepository.createSession({
            ip,
            title,
            userId: meta!.userId,
            deviceId: meta!.deviceId,
            lastActiveDate: meta!.lastActiveTokenDate,
            expiredTokenDate: meta!.expiredTokenDate
        })
    }
    async updateLastActiveDataSession(refreshToken: string): Promise<boolean> {
        const meta = await jwtService.getJWTData<RefreshPayloadType>(refreshToken,settings.JWT_REFRESH_SECRET)
        return securityRepository.updateLastActiveDataSession(meta!.userId,meta!.deviceId,meta!.lastActiveTokenDate)
    }
    async deleteAllSessionsWithoutCurrent(userId: string, deviceId: string): Promise<boolean> {
        return securityRepository.deleteAllSessionsWithoutCurrent(userId,deviceId)
    }
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        return securityRepository.deleteSessionByDeviceId(deviceId)
    }
    async checkRefreshToken(token: string): Promise<RefreshPayloadType | null>{
        const meta = await jwtService.getJWTData<RefreshPayloadType>(token, settings.JWT_REFRESH_SECRET);
        if(meta?.userId){
            const data = await securityQueryRepository.findSession(meta.userId,meta.deviceId);
            if(data && isEqual(new Date(meta.lastActiveTokenDate),new Date(data.lastActiveDate))){
                return ({
                    userId: meta.userId,
                    deviceId: meta.deviceId
                })
            }
        }
        return null
    }
}

export const securityService = new SecurityService()