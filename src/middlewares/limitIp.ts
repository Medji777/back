import {NextFunction, Request, Response} from "express";
import {Statuses} from "../types/types";

type AttemptData = {
    url: string,
    attempts: number,
    date: Date
}

type Requests = {
    ip: string,
    attemptData: Array<AttemptData>
}

const requests: Array<Requests> = [];

export const limitIp = (req:Request,res:Response,next:NextFunction) => {
    const nowDate = new Date();
    const limitSecondsRate = 10;
    const maxAttempts = 5;

    const requestApi = requests.find((request: Requests)=>request.ip === req.ip);
    if(!requestApi){
        const requestData = {
            ip: req.ip,
            attemptData: [
                {url: req.url, attempts: 1, date: nowDate}
            ]
        }
        requests.push(requestData)
        return next()
    }

    const urlData = requestApi.attemptData.find((urlData: AttemptData)=>urlData.url === req.url)
    if(!urlData){
        requestApi.attemptData.push({url: req.url, attempts: 1, date: nowDate})
        return next()
    }

    const apiRequestTime = (nowDate.getTime() - urlData.date.getTime()) / 1000
    if(apiRequestTime > limitSecondsRate){
        urlData.date = nowDate
        urlData.attempts = 1
        return next()
    }

    urlData.attempts += 1

    if(apiRequestTime < limitSecondsRate && urlData.attempts <= maxAttempts){
        return next()
    }
    res.sendStatus(Statuses.TOO_MANY_REQUEST)
}