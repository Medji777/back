import {blogsQueryRepository, QueryBlogs, BlogsQueryRepository} from "./blogsQuery";
import {postsQueryRepository, QueryPosts, PostsQueryRepository} from "./postsQuery";
import {commentsQueryRepository, QueryComments, CommentsQueryRepository} from "./commentsQuery";
import {commentsLikeQueryRepository, CommentsLikeQueryRepository} from "./commentsLikeQuery";
import {PostsLikeQueryRepository} from './postsLikeQuery';
import {UsersQueryRepository, QueryUsers} from './usersQuery';

export {
    blogsQueryRepository, QueryBlogs, BlogsQueryRepository,
    postsQueryRepository, QueryPosts, PostsQueryRepository,
    PostsLikeQueryRepository,
    UsersQueryRepository, QueryUsers,
    commentsQueryRepository, QueryComments, CommentsQueryRepository,
    commentsLikeQueryRepository, CommentsLikeQueryRepository
}