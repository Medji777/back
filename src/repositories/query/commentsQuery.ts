import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {CommentsModelInstance as CommentsModel} from "../../domain";
import {CommentsLikeQueryRepository} from "./commentsLikeQuery";
import {QueryPosts} from "./postsQuery";
import {getSortNumber} from "../../utils/sort";
import {transformPagination} from "../../utils/transform";
import {CommentDBModel, CommentViewModel} from "../../types/comments";
import {LikeStatus, Paginator} from "../../types/types";

export type QueryComments = QueryPosts;

@injectable()
export class CommentsQueryRepository {
    constructor(
        @inject(CommentsLikeQueryRepository) protected commentsLikeQueryRepository: CommentsLikeQueryRepository
    ) {}
    async findById(id: string, userId?: string): Promise<CommentViewModel | null>{
        const doc = await CommentsModel.findOne({id},{_id:0,postId:0,__v:0})
        if(!doc) return null
        const mappedResult = this._getOutputComment(doc)
        if (userId && mappedResult) {
            await this._setLike(userId, mappedResult)
        }
        return mappedResult
    }
    async getCommentsByPostId(id: string, query: QueryComments, userId?: string): Promise<Paginator<CommentViewModel>>{
        const filter = {postId: id};
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await CommentsModel.countDocuments(filter);
        const doc = await CommentsModel
            .find(filter,{_id:0,postId:0,__v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)

        const mappedComments = doc.map(this._getOutputComment)
        const mappedCommentsWithStatusLike = await this._setStatusLikeMapped(mappedComments, userId!)

        return transformPagination<CommentViewModel>(mappedCommentsWithStatusLike,pageSize,pageNumber,count)
    }
    private _getOutputComment(comment: HydratedDocument<CommentDBModel>): CommentViewModel {
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: LikeStatus.None
            }
        }
    }
    private async _setStatusLikeMapped(comments: Array<CommentViewModel>, userId: string): Promise<Array<CommentViewModel>> {
        if (!userId) return comments
        await Promise.all(comments.map(async (comment: CommentViewModel) => {
            await this._setLike(userId, comment)
        }))
        return comments
    }
    private async _setLike(userId: string, model: CommentViewModel): Promise<void>{
        const like = await this.commentsLikeQueryRepository.getLike(userId, model.id)
        if (like) {
            model.likesInfo.myStatus = like.myStatus
        }
    }
}