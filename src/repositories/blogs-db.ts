import {BlogsViewModel} from '../types/blogs'
import {BlogsModel} from "./db";
import {HydratedDocument} from "mongoose";
import {BlogsModelMethods} from "./schema/blogs";

type BlogDocument = HydratedDocument<BlogsViewModel, BlogsModelMethods>

export const blogsRepository = {
    // async create(payload: BlogsViewModel): Promise<BlogsViewModel> {
    //     await BlogsModel.create({...payload});
    //     return payload
    // },
    // async update(id: string, payload: BlogsInputModel): Promise<boolean> {
    //     const result = await BlogsModel.updateOne({id},{$set:{...payload}});
    //     return result.matchedCount === 1
    // },
    async deleteById(id: string): Promise<boolean> {
        const result = await BlogsModel.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await BlogsModel.deleteMany({})
    },
    async createV2(payload: BlogsViewModel): Promise<BlogDocument> {
        return new BlogsModel({...payload})
        // await doc.save()
        // return {
        //     id: doc.id,
        //     name: doc.name,
        //     description: doc.description,
        //     websiteUrl: doc.websiteUrl,
        //     createdAt: doc.createdAt,
        //     isMembership: doc.isMembership
        // }
    },
    async findBlogById(id: string): Promise<BlogDocument | null>{
        return BlogsModel.findOne({id})
    },
    async save(model: BlogDocument): Promise<BlogDocument> {
       return model.save()
    }
}