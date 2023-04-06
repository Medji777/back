import {Router} from "express";
import {securityController} from "../composition-root";
import {checkRefreshTokenMiddleware} from "../middlewares/auth";

export const securityRouter = Router({});

securityRouter.get('/devices',
    checkRefreshTokenMiddleware,
    securityController.getDevices.bind(securityController)
)
securityRouter.delete('/devices',
    checkRefreshTokenMiddleware,
    securityController.deleteAllDevices.bind(securityController)
)
securityRouter.delete('/devices/:deviceId',
    checkRefreshTokenMiddleware,
    securityController.deleteDeviceById.bind(securityController)
)