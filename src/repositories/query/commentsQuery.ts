import {QueryPosts} from "./postsQuery";
import {getSortNumber} from "../../utils/sort";
import {CommentsModel} from "../db";
import {transformPagination} from "../../utils/transform";
import {CommentViewModel} from "../../types/comments";
import {Paginator} from "../../types/types";

export type QueryComments = QueryPosts;

export const commentsQueryRepository = {
    async getAll(query: QueryComments): Promise<Paginator<CommentViewModel>>{
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await CommentsModel.countDocuments();
        const data = await CommentsModel
            .find({},{_id:0,postId:0,__v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .lean()
        return transformPagination<CommentViewModel>(data,pageSize,pageNumber,count)
    },
    async findById(id: string): Promise<CommentViewModel | null>{
        return CommentsModel.findOne({id},{_id:0,postId:0,__v:0}).lean()
    },
    async getCommentsByPostId(id: string, query: QueryComments): Promise<Paginator<CommentViewModel>>{
        const filter = {postId: id};
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await CommentsModel.countDocuments(filter);
        const data = await CommentsModel
            .find(filter,{_id:0,postId:0,__v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .lean()
        return transformPagination<CommentViewModel>(data,pageSize,pageNumber,count)
    }
}