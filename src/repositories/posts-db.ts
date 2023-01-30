import {PostsViewModel, PostInputModel} from '../types/posts'
import {postsCollection} from "./db";

export const postsRepository = {
    async create(payload: PostsViewModel): Promise<PostsViewModel> {
        await postsCollection.insertOne({...payload})
        return payload
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