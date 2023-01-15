import {NextFunction, Request, Response} from "express";
import {pick} from "../utils";

type sBodyPaths = Array<string>

export const sanitizationBody = (paths: sBodyPaths) => (req:Request,res:Response,next:NextFunction) => {
    req.body = pick(req.body, paths);
    next()
}