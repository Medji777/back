import {QueryPosts} from "./postsQuery";
import {getSortNumber} from "../../utils/sort";
import {commentsCollection} from "../db";
import {transformPagination} from "../../utils/transform";
import {CommentViewModel} from "../../types/comments";
import {Paginator} from "../../types/types";

export type QueryComments = QueryPosts;

export const commentsQueryRepository = {
    async getAll(query: QueryComments): Promise<Paginator<CommentViewModel>>{
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await commentsCollection.countDocuments();
        const data = await commentsCollection
            .find({},{projection: {_id:0,postId:0}})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .toArray()
        return transformPagination<CommentViewModel>(data,pageSize,pageNumber,count)
    },
    async findById(id: string): Promise<CommentViewModel | null>{
        return commentsCollection.findOne({id},{projection: {_id:0,postId:0}})
    },
    async getCommentsByPostId(id: string, query: QueryComments): Promise<Paginator<CommentViewModel>>{
        const filter = {postId: id};
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await commentsCollection.countDocuments(filter);
        const data = await commentsCollection
            .find(filter,{projection: {_id:0,postId:0}})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .toArray()
        return transformPagination<CommentViewModel>(data,pageSize,pageNumber,count)
    }
}