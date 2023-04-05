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

const emailAdapter = new EmailAdapter()
const emailManager = new EmailManager(emailAdapter)

const usersRepository = new UsersRepository()
const postsRepository = new PostsRepository()
const blogsRepository = new BlogsRepository()
const securityRepository = new SecurityRepository()
const postsLikesRepository = new PostsLikesRepository()
const videosRepository = new VideosRepository()
const commentsRepository = new CommentsRepository()
const commentsLikesRepository = new CommentsLikesRepository()

export const usersQueryRepository = new UsersQueryRepository()
export const blogsQueryRepository = new BlogsQueryRepository()
const commentsLikeQueryRepository = new CommentsLikeQueryRepository()
const commentsQueryRepository = new CommentsQueryRepository(commentsLikeQueryRepository)
const securityQueryRepository = new SecurityQueryRepository()
const postsLikeQueryRepository = new PostsLikeQueryRepository()
const postsQueryRepository = new PostsQueryRepository(postsLikeQueryRepository)

export const jwtService = new JwtService()
const likeCalculateService = new LikeCalculateService()
export const securityService = new SecurityService(jwtService,securityRepository,securityQueryRepository)
const usersService = new UsersService(usersRepository,usersQueryRepository)
const authService = new AuthService(emailManager,usersService,usersQueryRepository)

const blogsService = new BlogsService(blogsRepository)
const postsService = new PostsService(
    likeCalculateService,postsRepository,postsLikesRepository,postsQueryRepository,postsLikeQueryRepository
)
const commentsService = new CommentsService(
    likeCalculateService,commentsRepository,commentsLikesRepository,commentsQueryRepository, commentsLikeQueryRepository
)

export const authController = new AuthController(jwtService,securityService,authService,usersService,usersQueryRepository)
export const usersController = new UsersController(usersService,usersQueryRepository)
export const videoController = new VideoController(videosRepository)
export const blogsController = new BlogsController(blogsService,postsService,blogsQueryRepository,postsQueryRepository)
export const commentsController = new CommentsController(commentsService,commentsQueryRepository)
export const securityController = new SecurityController(securityService,securityQueryRepository)
export const postController = new PostsController(
    postsService,commentsService,postsQueryRepository,blogsQueryRepository,commentsQueryRepository
);