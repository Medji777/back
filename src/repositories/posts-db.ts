import {PostsViewModel, PostInputModel} from '../types/posts'
import {PostsModel} from "./db";

export const postsRepository = {
    async create(payload: PostsViewModel): Promise<PostsViewModel> {
        await PostsModel.create({...payload})
        return payload
    },
    async update(id: string,payload:PostInputModel): Promise<boolean> {
        const result = await PostsModel.updateOne({id},{$set:{...payload}});
        return result.matchedCount === 1
    },
    async deleteById(id: string): Promise<boolean> {
        const result = await PostsModel.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await PostsModel.deleteMany({})
    }
}