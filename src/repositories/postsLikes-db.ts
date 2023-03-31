import {PostsLikeModel} from "./db";
import {LikeStatus} from "../types/types";
import {LikesPostsModel, MyStatus} from "../types/likes";

export const postsLikesRepository = {
    async create(newLike: LikesPostsModel): Promise<MyStatus> {
        const doc = new PostsLikeModel(newLike)
        await doc.save()
        return {
           myStatus: doc.myStatus
        }
    },
    async update(userId: string, postId: string, myStatus: LikeStatus): Promise<boolean> {
        const doc = await PostsLikeModel.findOne({userId,postId})
        if(!doc) return false;
        doc.myStatus = myStatus
        await doc.save()
        return true
    }
}