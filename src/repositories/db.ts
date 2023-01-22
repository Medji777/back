import {MongoClient} from "mongodb";
import {config} from 'dotenv';
import {BlogsViewModel} from '../types/blogs'
import {PostsViewModel} from '../types/posts'
import {IVideo} from "../types/videos";

config()

const URI = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(URI);

const db = client.db("back");
export const blogsCollection = db.collection<BlogsViewModel>('blogs');
export const postsCollection = db.collection<PostsViewModel>('posts');
export const videosCollection = db.collection<IVideo>('videos');

export async function runDb () {
    try {
        await client.connect();
        await client.db("back").command({ping: 1})
        console.log("Connected to DB Ok!",URI)
    }
    catch (e) {
        console.log("Connected to DB failed!")
        await client.close()
    }
}
