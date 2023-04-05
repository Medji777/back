import {QueryBlogs, BlogsQueryRepository} from "./blogsQuery";
import {QueryPosts, PostsQueryRepository} from "./postsQuery";
import {QueryComments, CommentsQueryRepository} from "./commentsQuery";
import {CommentsLikeQueryRepository} from "./commentsLikeQuery";
import {PostsLikeQueryRepository} from './postsLikeQuery';
import {QueryUsers, UsersQueryRepository} from './usersQuery';

export {
    QueryBlogs, BlogsQueryRepository,
    QueryPosts, PostsQueryRepository,
    PostsLikeQueryRepository,
    UsersQueryRepository, QueryUsers,
    QueryComments, CommentsQueryRepository,
    CommentsLikeQueryRepository
}