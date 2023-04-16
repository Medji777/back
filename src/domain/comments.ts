import {model, Schema} from "mongoose";
import {CommentModel} from "../types/comments";

const commentsSchema = new Schema({
    id: String,
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
    }
})

export const CommentsModelInstance = model<CommentModel>('comments', commentsSchema);