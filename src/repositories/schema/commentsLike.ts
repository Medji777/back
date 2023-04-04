import {Schema} from "mongoose";
import {LikesCommentModelDTO} from "../../types/likes";
import {LikeStatus} from "../../types/types";

const commentsLikeSchema = new Schema<LikesCommentModelDTO>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    myStatus: {
        type: String,
        enum: Object.values(LikeStatus),
        required: true
    }
})

export default commentsLikeSchema