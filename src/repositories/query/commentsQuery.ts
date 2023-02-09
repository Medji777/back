import {QueryPosts} from "./postsQuery";
import {getSortNumber} from "../../utils/sort";
import {commentsCollection} from "../db";
import {transformPagination} from "../../utils/transform";
import {CommentViewModel} from "../../types/comments";

export const commentsQueryRepository = {
    async getAll(query: QueryPosts){
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
    async getCommentsByPostId(id: string, query: QueryPosts){
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