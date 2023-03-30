import {CommentatorInfo, CommentDBModel, CommentInputModel, CommentViewModel, PostId} from "../types/comments";
import {commentsLikesRepository, commentsRepository} from "../repositories";
import {LikeStatus} from "../types/types";
import {LikeInputModel} from "../types/likes";
import {commentsLikeQueryRepository, commentsQueryRepository} from "../repositories/query";
import {likeCalculateService} from "../application/likeCalculate.service";

type CommentPayload = CommentInputModel & CommentatorInfo & PostId

export const commentsService = {
    async create(payload: CommentPayload): Promise<CommentViewModel>{
        const date = new Date();
        const newComment = {
            id: `${+date}`,
            content: payload.content,
            postId: payload.postId,
            commentatorInfo: {
                userId: payload.userId,
                userLogin: payload.userLogin
            },
            createdAt: date.toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            }
        }
        const comment = await commentsRepository.create(newComment);
        return this._likeCreateTransform(comment);
    },
    async update(id: string, payload: CommentInputModel): Promise<boolean> {
        return commentsRepository.update(id,payload)
    },
    async updateLike(commentId: string, userId: string, payload: LikeInputModel): Promise<boolean> {
        let lastStatus: LikeStatus = LikeStatus.None;
        const comment = await commentsQueryRepository.findById(commentId)
        if(!comment) return false;
        const likeInfo = await commentsLikeQueryRepository.getLike(userId, commentId);
        if(!likeInfo){
            await commentsLikesRepository.create({
                commentId,
                userId,
                myStatus: payload.likeStatus
            })
        } else {
            const updatedLike = { myStatus: payload.likeStatus }
            await commentsLikesRepository.updateLike(likeInfo, updatedLike)
            lastStatus = likeInfo.myStatus
        }
        const likesInfo = {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount
        }
        const likeInfoCalc = await likeCalculateService.getUpdatedLike(likesInfo, lastStatus, payload.likeStatus);
        await commentsRepository.updateLikeInComment(comment.id!, likeInfoCalc)
        return true
    },
    async delete(id: string): Promise<boolean> {
        return commentsRepository.delete(id)
    },
    _likeCreateTransform(comment: CommentDBModel): CommentViewModel {
        return ({
            ...comment,
            likesInfo: {
                ...comment.likesInfo,
                myStatus: LikeStatus.None
            }
        })
    }
}