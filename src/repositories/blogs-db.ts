import {HydratedDocument} from "mongoose";
import {BlogsModel} from "./db";
import {BlogsViewModel, BlogsViewModelDTO} from '../types/blogs'
import {BlogsModelMethods} from "./schema/blogs";
import {injectable} from "inversify";

type BlogDocument = HydratedDocument<BlogsViewModel, BlogsModelMethods>

@injectable()
export class BlogsRepository {
    async create(payload: BlogsViewModelDTO): Promise<BlogDocument> {
        return new BlogsModel(payload)
    }
    async findBlogById(id: string): Promise<BlogDocument | null>{
        return BlogsModel.findOne({id})
    }
    async save(model: BlogDocument): Promise<BlogDocument> {
        return model.save()
    }
    async deleteById(id: string): Promise<boolean> {
        const result = await BlogsModel.deleteOne({id});
        return result.deletedCount === 1
    }
    async deleteAll(): Promise<void>{
        await BlogsModel.deleteMany({})
    }
}

export const blogsRepository = new BlogsRepository()