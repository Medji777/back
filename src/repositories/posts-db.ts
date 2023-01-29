import {PostsViewModel, PostInputModel, BlogName} from '../types/posts'
import {postsCollection} from "./db";

export const postsRepository = {
    async create(payload: PostInputModel & BlogName): Promise<PostsViewModel> {
        const date = new Date();
        const newPost = {
            id:	`${+date}`,
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: payload.blogName,
            createdAt: date.toISOString()
        }
        await postsCollection.insertOne({...newPost})
        return newPost
    },
    async update(id: string,payload:PostInputModel): Promise<boolean> {
        const result = await postsCollection.updateOne({id},{$set:{...payload}});
        return result.matchedCount === 1
    },
    async deleteById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await postsCollection.deleteMany({})
    }
}