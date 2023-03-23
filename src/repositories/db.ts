import {connect, disconnect, model} from "mongoose";
import {settings} from "../settings";
import {BlogsViewModel} from '../types/blogs'
import {PostsViewModel} from '../types/posts'
import {IVideo} from "../types/videos";
import {UserModel} from "../types/users";
import {CommentModel} from "../types/comments";
import {DeviceModel} from "../types/security";
import {usersSchema, blogsSchema, postsSchema, commentsSchema, videoSchema, sessionsSchema} from "./schema";

export const UsersModel = model<UserModel>('users', usersSchema);
export const BlogsModel = model<BlogsViewModel>('blogs', blogsSchema);
export const PostsModel = model<PostsViewModel>('posts', postsSchema);
export const CommentsModel = model<CommentModel>('comments', commentsSchema);
export const VideoModel = model<IVideo>('videos', videoSchema);
export const SessionsModel = model<DeviceModel>('sessions', sessionsSchema);

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
