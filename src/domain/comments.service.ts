import {CommentatorInfo, CommentInputModel, CommentViewModel, PostId} from "../types/comments";
import {commentsRepository} from "../repositories/comments-db";

export const commentsService = {
    getAll(){

    },
    getById(){

    },
    async create(payload: CommentInputModel & CommentatorInfo & PostId): Promise<CommentViewModel>{
        const date = new Date();
        const newComment = {
            id: `${+date}`,
            content: payload.content,
            postId: payload.postId,
            commentatorInfo: {
                userId: payload.userId,
                userLogin: payload.userLogin
            },
            createdAt: date.toISOString()
        }
        return commentsRepository.create(newComment)
    },
    update(){

    },
    delete(){

    }
}