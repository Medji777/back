import {injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {CommentsLikeModel} from "./db";
import {LikesCommentModel, LikesCommentModelDTO} from "../types/likes";
import {LikeStatus} from "../types/types";

type LikesInfo = {
    userId: string,
    commentId: string,
}

@injectable()
export class CommentsLikesRepository {
    async create(newLike: LikesCommentModelDTO): Promise<LikesCommentModel> {
        const newDoc = await new CommentsLikeModel(newLike)
        await this.save(newDoc);
        return {
            userId: newDoc.userId,
            commentId: newDoc.commentId,
            myStatus: newDoc.myStatus
        }
    }
    async updateLike(likeInfo: LikesInfo, myStatus: LikeStatus): Promise<boolean>{
        const doc = await CommentsLikeModel.findOne(likeInfo)
        if(!doc) return false;
        doc.myStatus = myStatus;
        await this.save(doc);
        return true;
    }
    async save(model: HydratedDocument<LikesCommentModel>): Promise<void> {
        await model.save()
    }
}