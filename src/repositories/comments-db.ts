import {CommentModel, CommentInputModel, CommentDBModel} from "../types/comments";
import {CommentsModel} from "./db";
import {HydratedDocument} from "mongoose";
import {LikeInfoModel} from "../types/likes";

export const commentsRepository = {
    async create(payload: CommentModel): Promise<CommentDBModel>{
        const doc = new CommentsModel({...payload})
        await this.save(doc)
        return {
            id: doc.id,
            content: doc.content,
            commentatorInfo: doc.commentatorInfo,
            createdAt: doc.createdAt,
            likesInfo: {
                likesCount: doc.likesInfo.likesCount,
                dislikesCount: doc.likesInfo.dislikesCount
            }
        }
    },
    async update(id: string, payload: CommentInputModel): Promise<boolean>{
        const doc = await CommentsModel.findOne({id});
        if(!doc) return false;
        doc.content = payload.content;
        await this.save(doc);
        return true;
    },
    async delete(id: string): Promise<boolean>{
        const result = await CommentsModel.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await CommentsModel.deleteMany({})
    },
    async updateLikeInComment(id: string, likesInfo: LikeInfoModel): Promise<boolean>{
        const doc = await CommentsModel.findOne({id})
        if(!doc) return false;
        doc.likesInfo.likesCount = likesInfo.likesCount
        doc.likesInfo.dislikesCount = likesInfo.dislikesCount
        await this.save(doc)
        return true
    },
    async save(model: HydratedDocument<CommentDBModel>): Promise<void> {
        await model.save()
    }
}