import {injectable} from "inversify";
import {
    UsersModelInstance,
    BlogsModel,
    CommentsLikeModelInstance,
    CommentsModelInstance,
    PostsLikeModelInstance,
    PostsModelInstance,
    SessionsModelInstance,
    VideoModelInstance
} from '../domain';

@injectable()
export class TestsRepository {
    async resetAllData(): Promise<void> {
        await UsersModelInstance.deleteMany({})
        await PostsModelInstance.deleteMany({})
        await BlogsModel.deleteMany({})
        await CommentsModelInstance.deleteMany({})
        await VideoModelInstance.deleteMany({})
        await SessionsModelInstance.deleteMany({})
        await CommentsLikeModelInstance.deleteMany({})
        await PostsLikeModelInstance.deleteMany({})
    }
    async resetAllSessions(): Promise<void> {
        await SessionsModelInstance.deleteMany({})
    }
}