import {Router} from "express";
import {securityController} from "../controllers";
import {checkRefreshTokenMiddleware} from "../middlewares/auth";

export const securityRouter = Router({});

securityRouter.get('/devices',checkRefreshTokenMiddleware,securityController.getDevices)
securityRouter.delete('/devices',checkRefreshTokenMiddleware,securityController.deleteAllDevices)
securityRouter.delete('/devices/:deviceId',checkRefreshTokenMiddleware,securityController.deleteDeviceById)