import {HydratedDocument} from "mongoose";
import {CommentsLikeModel} from "../db";
import {LikesCommentModel} from "../../types/likes";

export class CommentsLikeQueryRepository {
    async getLike(userId: string, commentId: string): Promise<LikesCommentModel | null> {
        const result = await CommentsLikeModel.findOne({userId, commentId})
        if (!result) return null
        return this._getOutputLike(result)
    }
    private _getOutputLike(like: HydratedDocument<LikesCommentModel>): LikesCommentModel {
        return {
            userId: like.userId,
            commentId: like.commentId,
            myStatus: like.myStatus
        }
    }
}