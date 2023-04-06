import {Router} from "express";
import {testsController} from "../composition-root";

export const resetRouter = Router()

resetRouter.delete('/all-data',testsController.resetAllData.bind(testsController))
resetRouter.delete('/sessions',testsController.resetAllSessions.bind(testsController))