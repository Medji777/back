import {HydratedDocument} from "mongoose";
import {PostInputModel, PostsDBModel} from '../types/posts'
import {PostsModel} from "./db";
import {LikeInfoModel} from "../types/likes";

export const postsRepository = {
    async create(payload: PostsDBModel): Promise<PostsDBModel> {
        const doc = new PostsModel(payload)
        await doc.save()
        return this._mappedPostModel(doc)
    },
    async update(id: string, payload:PostInputModel): Promise<boolean> {
        const doc = await PostsModel.findOne({id});
        if(!doc) return false;
        doc.update(payload)
        await doc.save()
        return true
    },
    async deleteById(id: string): Promise<boolean> {
        const result = await PostsModel.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void> {
        await PostsModel.deleteMany({})
    },
    async updateLikeInPost(id: string, likesInfo: LikeInfoModel): Promise<boolean> {
        const doc = await PostsModel.findOne({id})
        if(!doc) return false;
        doc.extendedLikesInfo = likesInfo
        await doc.save()
        return true
    },
    _mappedPostModel(model: HydratedDocument<PostsDBModel>): PostsDBModel{
        return {
            id: model.id,
            title: model.title,
            shortDescription: model.shortDescription,
            content: model.content,
            blogId: model.blogId,
            blogName: model.blogName,
            createdAt: model.createdAt,
            extendedLikesInfo: model.extendedLikesInfo
        }
    }
}