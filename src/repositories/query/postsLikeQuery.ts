import {HydratedDocument} from "mongoose";
import {PostsLikeModel} from "../db";
import {LikesPostsExtendedViewModel, LikesPostsModel} from "../../types/likes";
import {LikeStatus} from "../../types/types";

export const postsLikeQueryRepository = {
    async getLastThreeLikes(postId: string): Promise<LikesPostsExtendedViewModel[]> {
        const desc = -1
        const threeLastUser = 3
        const result = await PostsLikeModel
            .find({ postId: postId, myStatus: LikeStatus.Like })
            .sort({ addedAt: desc })
            .limit(threeLastUser)

        if (!result) return []
        return result.map(this._getOutputExtendedLike)
    },
    async getLike(userId: string, postId: string): Promise<LikesPostsModel | null> {
        const result = await PostsLikeModel.findOne({ userId, postId })
        if (!result) return null
        return this._getOutputLike(result)
    },
    _getOutputLike(like: HydratedDocument<LikesPostsModel>): LikesPostsModel {
        return {
            userId: like.userId,
            postId: like.postId,
            myStatus: like.myStatus,
            login: like.login,
            addedAt: like.addedAt
        }
    },
    _getOutputExtendedLike(like: LikesPostsModel): LikesPostsExtendedViewModel {
        return {
            addedAt: like.addedAt,
            userId: like.userId,
            login: like.login
        }
    }
}