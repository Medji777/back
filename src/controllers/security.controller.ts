import {Request,Response} from "express"
import {inject, injectable} from "inversify";
import {SecurityQueryRepository} from "../repositories/query/securityQuery";
import {RequestWithParams, Statuses} from "../types/types";
import {SecurityService} from "../services";

@injectable()
export class SecurityController {
    constructor(
        @inject(SecurityService) protected securityService: SecurityService,
        @inject(SecurityQueryRepository) protected securityQueryRepository: SecurityQueryRepository
    ) {}
    async getDevices(req: Request, res: Response){
        const sessions = await this.securityQueryRepository.getAllActiveSessions(req.user!.id);
        res.status(Statuses.OK).send(sessions)
    }
    async deleteAllDevices(req: Request, res: Response){
        const isDeleted = await this.securityService.deleteAllSessionsWithoutCurrent(req.user!.id,req.deviceId!);
        if(!isDeleted){
            return res.sendStatus(Statuses.BAD_REQUEST)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async deleteDeviceById(req: RequestWithParams<{deviceId: string}>, res: Response){
        const isInclude = await this.securityQueryRepository.checkSessionByDeviceId(req.params.deviceId);
        if(!isInclude){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        const session = await this.securityQueryRepository.findSession(req.user!.id,req.params.deviceId)
        if(!session) {
            return res.sendStatus(Statuses.FORBIDDEN)
        }
        const isDelete = await this.securityService.deleteSessionByDeviceId(req.params.deviceId)
        if(!isDelete){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
}