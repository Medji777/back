import {inject, injectable} from "inversify";
import {TestsRepository} from "../repositories/tests-db";

@injectable()
export class TestsService {
    constructor(
        @inject(TestsRepository) protected testsRepository: TestsRepository
    ) {}
    async resetAllData(): Promise<void> {
        return this.testsRepository.resetAllData()
    }
    async resetAllSessions(): Promise<void> {
        return this.testsRepository.resetAllSessions()
    }
}