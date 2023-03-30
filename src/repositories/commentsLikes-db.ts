import {CommentsLikeModel} from "./db";
import {LikesCommentModel} from "../types/likes";
import {HydratedDocument} from "mongoose";
import {LikeStatus} from "../types/types";

type LikesInfo = {
    userId: string,
    commentId: string,
}

export const commentsLikesRepository = {
    async create(newLike: LikesCommentModel): Promise<LikesCommentModel> {
        const newDoc = await new CommentsLikeModel(newLike)
        await this.save(newDoc);
        return {
            userId: newDoc.userId,
            commentId: newDoc.commentId,
            myStatus: newDoc.myStatus
        }
    },
    async updateLike(likeInfo: LikesInfo, myStatus: LikeStatus): Promise<boolean>{
        const doc = await CommentsLikeModel.findOne(likeInfo)
        if(!doc) return false;
        doc.myStatus = myStatus;
        await this.save(doc);
        return true;
    },
    async save(model: HydratedDocument<LikesCommentModel>): Promise<void> {
        await model.save()
    }
}