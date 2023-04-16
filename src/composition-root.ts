import "reflect-metadata";
import {Container} from "inversify";
import {
    AuthController,
    UsersController,
    VideoController,
    SecurityController,
    PostsController,
    CommentsController,
    BlogsController
} from "./controllers";
import {
    AuthService,
    BlogsService,
    CommentsService,
    PostsService,
    SecurityService,
    UsersService
} from "./services";
import {
    BlogsQueryRepository, CommentsLikeQueryRepository,
    CommentsQueryRepository, PostsLikeQueryRepository,
    PostsQueryRepository,
    UsersQueryRepository
} from "./repositories/query";
import {
    BlogsRepository,
    CommentsLikesRepository,
    CommentsRepository, PostsLikesRepository,
    PostsRepository, SecurityRepository,
    UsersRepository,
    VideosRepository
} from "./repositories";
import {JwtService} from "./application/jwt.service";
import {EmailManager} from "./managers/email.manager";
import {EmailAdapter} from "./adapters/email.adapter";
import {SecurityQueryRepository} from "./repositories/query/securityQuery";
import {LikeCalculateService} from "./application/likeCalculate.service";
import {TestsController} from "./controllers/tests.controller";
import {TestsService} from "./services/tests.service";
import {TestsRepository} from "./repositories/tests-db";

export const container = new Container();
container.bind(EmailManager).to(EmailManager)
container.bind(EmailAdapter).to(EmailAdapter)
container.bind(JwtService).to(JwtService)
container.bind(LikeCalculateService).to(LikeCalculateService)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)

container.bind(VideoController).to(VideoController)
container.bind(VideosRepository).to(VideosRepository)

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(CommentsLikeQueryRepository).to(CommentsLikeQueryRepository)
container.bind(CommentsLikesRepository).to(CommentsLikesRepository)
container.bind(CommentsRepository).to(CommentsRepository)

container.bind(SecurityController).to(SecurityController)
container.bind(SecurityService).to(SecurityService)
container.bind(SecurityRepository).to(SecurityRepository)
container.bind(SecurityQueryRepository).to(SecurityQueryRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(PostsLikesRepository).to(PostsLikesRepository)
container.bind(PostsLikeQueryRepository).to(PostsLikeQueryRepository)

container.bind(TestsController).to(TestsController)
container.bind(TestsService).to(TestsService)
container.bind(TestsRepository).to(TestsRepository)

export const securityService = container.get(SecurityService)
export const jwtService = container.get(JwtService)
export const usersQueryRepository = container.get(UsersQueryRepository)
export const blogsQueryRepository = container.get(BlogsQueryRepository)

export const securityController = container.resolve(SecurityController)
export const commentsController = container.resolve(CommentsController)
export const videoController = container.resolve(VideoController)
export const blogsController = container.resolve(BlogsController)
export const authController = container.resolve(AuthController)
export const postController = container.resolve(PostsController)
export const usersController = container.resolve(UsersController)
export const testsController = container.resolve(TestsController)