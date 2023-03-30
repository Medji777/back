import {QueryPosts} from "./postsQuery";
import {getSortNumber} from "../../utils/sort";
import {CommentsModel} from "../db";
import {transformPagination} from "../../utils/transform";
import {CommentDBModel, CommentViewModel} from "../../types/comments";
import {LikeStatus, Paginator} from "../../types/types";
import {commentsLikeQueryRepository} from "./commentsLikeQuery";

export type QueryComments = QueryPosts;

export const commentsQueryRepository = {
    async findById(id: string, userId?: string): Promise<CommentViewModel | null>{
        const doc = await CommentsModel.findOne({id},{_id:0,postId:0,__v:0})
        if(!doc) return null
        const mappedResult = this._getOutputComment(doc)
        if (userId && mappedResult) {
            const like = await commentsLikeQueryRepository.getLike(userId, mappedResult.id)
            if (like) {
                mappedResult.likesInfo.myStatus = like.myStatus
            }
        }
        return mappedResult
    },
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
        const mappedCommentsWithStatusLike = await this._setStatusLike(mappedComments, userId!)

        return transformPagination<CommentViewModel>(mappedCommentsWithStatusLike,pageSize,pageNumber,count)
    },
    _getOutputComment(comment: CommentDBModel): CommentViewModel {
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
    },
    async _setStatusLike(comments: Array<CommentViewModel>, userId: string): Promise<Array<CommentViewModel>> {
        if (!userId) return comments
        await Promise.all(comments.map(async (comment) => {
            const like = await commentsLikeQueryRepository.getLike(userId, comment.id)
            if (like) {
                comment.likesInfo.myStatus = like.myStatus
            }
        }))
        return comments
    }
}