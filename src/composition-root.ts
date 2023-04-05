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
} from "./domain";
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