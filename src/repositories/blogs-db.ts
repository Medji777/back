import {BlogsViewModel,BlogsInputModel} from '../types/blogs'
import {blogsCollection} from "./db";

export const blogsRepository = {
    async create(payload: BlogsViewModel): Promise<BlogsViewModel> {
        await blogsCollection.insertOne({...payload});
        return payload
    },
    async update(id: string, payload: BlogsInputModel): Promise<boolean> {
        const result = await blogsCollection.updateOne({id},{$set:{...payload}});
        return result.matchedCount === 1
    },
    async deleteById(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await blogsCollection.deleteMany({})
    }
}