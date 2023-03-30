import {Schema} from "mongoose";
import {LikesCommentModel} from "../../types/likes";
import {LikeStatus} from "../../types/types";

const commentsLikeSchema = new Schema<LikesCommentModel>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    myStatus: {
        type: String,
        enum: Object.values(LikeStatus),
        required: true
    }
})

export default commentsLikeSchema