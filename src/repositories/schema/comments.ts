import {Schema} from "mongoose";

const commentsSchema = new Schema({
    id: String,
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true}
})

export default commentsSchema