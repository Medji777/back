import {blogsRepository, BlogsRepository} from './blogs-db';
import {postsRepository, PostsRepository} from './posts-db';
import {videosRepository, VideosRepository} from './repo-db';
import {usersRepository, UsersRepository} from "./users-db";
import {commentsRepository, CommentsRepository} from "./comments-db";
import {securityRepository, SecurityRepository} from "./security-db";
import {commentsLikesRepository, CommentsLikesRepository} from "./commentsLikes-db";
import {PostsLikesRepository} from './postsLikes-db';

export {
    usersRepository, UsersRepository,
    blogsRepository, BlogsRepository,
    postsRepository, PostsRepository,
    commentsRepository, CommentsRepository,
    videosRepository, VideosRepository,
    securityRepository, SecurityRepository,
    commentsLikesRepository, CommentsLikesRepository,
    PostsLikesRepository
}