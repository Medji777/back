import {BlogsViewModel,BlogsInputModel} from '../types/blogs'
import {blogsCollection} from "./db";

export const blogsRepository = {
    async getAll(): Promise<Array<BlogsViewModel>> {
        return blogsCollection.find({}).toArray()
    },
    async findById(id: string): Promise<BlogsViewModel | null> {
        return blogsCollection.findOne({id})
    },
    async create(payload: BlogsInputModel): Promise<BlogsViewModel> {
        const date = new Date();
        const newBlog = {
            id:	`${+date}`,
            name: payload.name,
            description: payload.description,
            websiteUrl:	payload.websiteUrl,
            createdAt: date.toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return newBlog
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