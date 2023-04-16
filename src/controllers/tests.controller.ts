import {Request,Response} from "express"
import {inject, injectable} from "inversify";
import {TestsService} from "../services/tests.service";
import {Statuses} from "../types/types";

@injectable()
export class TestsController {
    constructor(
        @inject(TestsService) protected testsService: TestsService
    ) {}
    async resetAllData(req: Request, res: Response){
        await this.testsService.resetAllData()
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async resetAllSessions(req: Request, res: Response){
        await this.testsService.resetAllSessions()
        res.sendStatus(Statuses.NO_CONTENT)
    }
}