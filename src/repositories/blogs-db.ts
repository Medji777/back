import {BlogsViewModel,BlogsInputModel} from '../types/blogs'
import {BlogsModel} from "./db";

export const blogsRepository = {
    async create(payload: BlogsViewModel): Promise<BlogsViewModel> {
        await BlogsModel.create({...payload});
        return payload
    },
    async update(id: string, payload: BlogsInputModel): Promise<boolean> {
        const result = await BlogsModel.updateOne({id},{$set:{...payload}});
        return result.matchedCount === 1
    },
    async deleteById(id: string): Promise<boolean> {
        const result = await BlogsModel.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await BlogsModel.deleteMany({})
    }
}