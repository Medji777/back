import {CommentatorInfo, CommentDBModel, CommentInputModel, CommentViewModel, PostId} from "../types/comments";
import {LikeCalculateService} from "../application/likeCalculate.service";
import {CommentsQueryRepository, CommentsLikeQueryRepository} from "../repositories/query";
import {CommentsRepository, CommentsLikesRepository} from "../repositories";
import {LikeStatus} from "../types/types";
import {LikeInputModel, LikesCommentModelDTO} from "../types/likes";


type CommentPayload = CommentInputModel & CommentatorInfo & PostId

export class CommentsService {
    private commentsQueryRepository: CommentsQueryRepository;
    private commentsLikeQueryRepository: CommentsLikeQueryRepository;
    private commentsLikesRepository: CommentsLikesRepository;
    private likeCalculateService: LikeCalculateService;
    private commentsRepository: CommentsRepository;
    constructor() {
        this.likeCalculateService = new LikeCalculateService()
        this.commentsRepository = new CommentsRepository()
        this.commentsLikesRepository = new CommentsLikesRepository()
        this.commentsQueryRepository = new CommentsQueryRepository()
        this.commentsLikeQueryRepository = new CommentsLikeQueryRepository()
    }
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
        const comment = await this.commentsRepository.create(newComment);
        return this._likeCreateTransform(comment);
    }
    async update(id: string, payload: CommentInputModel): Promise<boolean> {
        return this.commentsRepository.update(id,payload)
    }
    async updateLike(commentId: string, userId: string, payload: LikeInputModel): Promise<boolean> {
        let lastStatus: LikeStatus = LikeStatus.None;
        const comment = await this.commentsQueryRepository.findById(commentId)
        if(!comment) return false;
        const likeInfo = await this.commentsLikeQueryRepository.getLike(userId, commentId);
        if(!likeInfo){
            const newComment = new LikesCommentModelDTO(userId,commentId,payload.likeStatus)
            await this.commentsLikesRepository.create(newComment)
        } else {
            await this.commentsLikesRepository.updateLike(likeInfo, payload.likeStatus)
            lastStatus = likeInfo.myStatus
        }
        const likesInfo = {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount
        }
        const likeInfoCalc = await this.likeCalculateService.getUpdatedLike(likesInfo, lastStatus, payload.likeStatus);
        await this.commentsRepository.updateLikeInComment(comment.id!, likeInfoCalc)
        return true
    }
    async delete(id: string): Promise<boolean> {
        return this.commentsRepository.delete(id)
    }
    private _likeCreateTransform(comment: CommentDBModel): CommentViewModel {
        return ({
            ...comment,
            likesInfo: {
                ...comment.likesInfo,
                myStatus: LikeStatus.None
            }
        })
    }
}