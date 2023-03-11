import {Router} from "express";
import {deleteAllDevices, deleteDeviceById, getDevices} from "../controllers/security.controller";
import {checkRefreshTokenMiddleware} from "../middlewares/auth";

export const securityRouter = Router({});

securityRouter.get('/devices',checkRefreshTokenMiddleware,getDevices)
securityRouter.delete('/devices',checkRefreshTokenMiddleware,deleteAllDevices)
securityRouter.delete('/devices/:deviceId',checkRefreshTokenMiddleware,deleteDeviceById)