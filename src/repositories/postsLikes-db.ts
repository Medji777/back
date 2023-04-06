import {injectable} from "inversify";
import {PostsLikeModel} from "./db";
import {LikeStatus} from "../types/types";
import {LikesPostsModelDTO, MyStatus} from "../types/likes";

@injectable()
export class PostsLikesRepository {
    async create(newLike: LikesPostsModelDTO): Promise<MyStatus> {
        const doc = new PostsLikeModel(newLike)
        await doc.save()
        return {
            myStatus: doc.myStatus
        }
    }
    async update(userId: string, postId: string, myStatus: LikeStatus): Promise<boolean> {
        const doc = await PostsLikeModel.findOne({userId,postId})
        if(!doc) return false;
        doc.myStatus = myStatus
        await doc.save()
        return true
    }
}