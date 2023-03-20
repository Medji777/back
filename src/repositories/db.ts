import {MongoClient} from "mongodb";
import {settings} from "../settings";
import {BlogsViewModel} from '../types/blogs'
import {PostsViewModel} from '../types/posts'
import {IVideo} from "../types/videos";
import {UserModel} from "../types/users";
import {CommentModel} from "../types/comments";
import {DeviceModel} from "../types/security";

export const client = new MongoClient(settings.mongoURI);

const db = client.db();
export const usersCollection = db.collection<UserModel>('users');
export const blogsCollection = db.collection<BlogsViewModel>('blogs');
export const postsCollection = db.collection<PostsViewModel>('posts');
export const commentsCollection = db.collection<CommentModel>('comments')
export const videosCollection = db.collection<IVideo>('videos');
export const sessionsCollection = db.collection<DeviceModel>('sessions');

export async function runDb () {
    try {
        await client.connect();
        await client.db().command({ping: 1})
        console.log("Connected to DB Ok!")
    }
    catch (e) {
        console.log("Connected to DB failed!")
        await client.close()
    }
}
