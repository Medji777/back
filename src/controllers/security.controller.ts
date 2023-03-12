import {Request,Response} from "express"
import {securityQueryRepository} from "../repositories/query/securityQuery";
import {RequestWithParams, Statuses} from "../types/types";
import {securityService} from "../domain/security.service";

export const getDevices = async (req: Request, res: Response) => {
    const sessions = await securityQueryRepository.getAllActiveSessions(req.user!.id);
    res.status(Statuses.OK).send(sessions)
}

export const deleteAllDevices = async (req: Request, res: Response) => {
    const isDeleted = await securityService.deleteAllSessionsWithoutCurrent(req.user!.id,req.deviceId!);
    if(!isDeleted){
        return res.sendStatus(Statuses.BAD_REQUEST)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteDeviceById = async (req: RequestWithParams<{deviceId: string}>, res: Response) => {
    const isInclude = await securityQueryRepository.checkSessionByDeviceId(req.params.deviceId);
    if(!isInclude){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    const session = await securityQueryRepository.findSession(req.user!.id,req.params.deviceId)
    if(!session) {
        return res.sendStatus(Statuses.FORBIDDEN)
    }
    const isDelete = await securityService.deleteSessionByDeviceId(req.params.deviceId)
    if(!isDelete){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}