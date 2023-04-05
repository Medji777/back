import {inject, injectable} from "inversify";
import {isEqual} from "date-fns";
import {JwtService} from "../application/jwt.service";
import {settings} from "../settings";
import {RefreshPayloadType} from "../types/tokens";
import {DeviceViewModel} from "../types/security";
import {SecurityQueryRepository} from "../repositories/query/securityQuery";
import {SecurityRepository} from "../repositories";

@injectable()
export class SecurityService {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(SecurityRepository) protected securityRepository: SecurityRepository,
        @inject(SecurityQueryRepository) protected securityQueryRepository: SecurityQueryRepository
    ) {}
    async createSession(refreshToken: string, title: string, ip: string): Promise<DeviceViewModel> {
        const meta = await this.jwtService.getJWTData<RefreshPayloadType>(refreshToken,settings.JWT_REFRESH_SECRET)
        return this.securityRepository.createSession({
            ip,
            title,
            userId: meta!.userId,
            deviceId: meta!.deviceId,
            lastActiveDate: meta!.lastActiveTokenDate,
            expiredTokenDate: meta!.expiredTokenDate
        })
    }
    async updateLastActiveDataSession(refreshToken: string): Promise<boolean> {
        const meta = await this.jwtService.getJWTData<RefreshPayloadType>(refreshToken,settings.JWT_REFRESH_SECRET)
        return this.securityRepository.updateLastActiveDataSession(meta!.userId,meta!.deviceId,meta!.lastActiveTokenDate)
    }
    async deleteAllSessionsWithoutCurrent(userId: string, deviceId: string): Promise<boolean> {
        return this.securityRepository.deleteAllSessionsWithoutCurrent(userId,deviceId)
    }
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        return this.securityRepository.deleteSessionByDeviceId(deviceId)
    }
    async checkRefreshToken(token: string): Promise<RefreshPayloadType | null>{
        const meta = await this.jwtService.getJWTData<RefreshPayloadType>(token, settings.JWT_REFRESH_SECRET);
        if(meta?.userId){
            const data = await this.securityQueryRepository.findSession(meta.userId,meta.deviceId);
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