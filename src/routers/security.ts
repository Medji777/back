import {Router} from "express";
import {container} from "../composition-root";
import {SecurityController} from "../controllers";
import {checkRefreshTokenMiddleware} from "../middlewares/auth";

export const securityRouter = Router({});

const securityController = container.resolve(SecurityController)

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