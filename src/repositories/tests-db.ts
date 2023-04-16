import {injectable} from "inversify";
import {
    UsersModel,
    BlogsModel,
    CommentsLikeModel,
    CommentsModel,
    PostsLikeModel,
    PostsModel,
    SessionsModel,
    VideoModel
} from '../domain';

@injectable()
export class TestsRepository {
    async resetAllData(): Promise<void> {
        await UsersModel.deleteMany({})
        await PostsModel.deleteMany({})
        await BlogsModel.deleteMany({})
        await CommentsModel.deleteMany({})
        await VideoModel.deleteMany({})
        await SessionsModel.deleteMany({})
        await CommentsLikeModel.deleteMany({})
        await PostsLikeModel.deleteMany({})
    }
    async resetAllSessions(): Promise<void> {
        await SessionsModel.deleteMany({})
    }
}