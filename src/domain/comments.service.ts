import {CommentatorInfo, CommentInputModel, CommentViewModel, PostId} from "../types/comments";
import {commentsRepository} from "../repositories";

export const commentsService = {
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
    async update(id: string, payload: CommentInputModel): Promise<boolean> {
        return commentsRepository.update(id,payload)
    },
    async delete(id: string): Promise<boolean> {
        return commentsRepository.delete(id)
    }
}