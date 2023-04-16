import {model, Schema} from "mongoose";
import {LikeStatus} from "../types/types";
import {LikesPostsModel, LikesPostsModelDTO} from "../types/likes";

const postsLikeSchema = new Schema<LikesPostsModel>({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    myStatus: {
        type: String,
        enum: Object.values(LikeStatus),
        required: true
    },
    login: {type: String, required: true},
    addedAt: {
        type: String,
        default: Date.now.toString
    }
})

export const PostsLikeModelInstance = model<LikesPostsModelDTO>('postsLike', postsLikeSchema);