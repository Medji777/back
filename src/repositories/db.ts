import {connect, disconnect, model} from "mongoose";
import {settings} from "../settings";
import {BlogsViewModel} from '../types/blogs'
import {PostsDBModel} from '../types/posts'
import {IVideo} from "../types/videos";
import {UserModel} from "../types/users";
import {CommentModel} from "../types/comments";
import {DeviceModel} from "../types/security";
import {LikesCommentModel, LikesPostsModel} from "../types/likes";
import {
    usersSchema,
    blogsSchema,
    postsSchema,
    commentsSchema,
    videoSchema,
    sessionsSchema,
    commentsLikeSchema,
    postsLikeSchema
} from "./schema";
import {BlogsModelType} from "./schema/blogs";
import {PostsModelType} from "./schema/posts";

export const UsersModel = model<UserModel>('users', usersSchema);
export const BlogsModel = model<BlogsViewModel,BlogsModelType>('blogs', blogsSchema);
export const PostsModel = model<PostsDBModel,PostsModelType>('posts', postsSchema);
export const CommentsModel = model<CommentModel>('comments', commentsSchema);
export const VideoModel = model<IVideo>('videos', videoSchema);
export const SessionsModel = model<DeviceModel>('sessions', sessionsSchema);
export const PostsLikeModel = model<LikesPostsModel>('postsLike', postsLikeSchema);
export const CommentsLikeModel = model<LikesCommentModel>('commentsLike', commentsLikeSchema)

export async function runDb () {
    try {
        await connect(settings.mongoURI)
        console.log("Connected to DB Ok!")
    }
    catch (e) {
        console.log("Connected to DB failed!")
        await disconnect()
    }
}
