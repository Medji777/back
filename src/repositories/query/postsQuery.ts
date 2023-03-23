import {Paginator, SortDirections} from "../../types/types";
import {PostsViewModel} from "../../types/posts";
import {getSortNumber} from "../../utils/sort";
import {PostsModel} from "../db";
import {transformPagination} from "../../utils/transform";

export type QueryPosts = {
    sortBy: string,
    sortDirection: SortDirections,
    pageNumber: number ,
    pageSize: number
}

export const postsQueryRepository = {
    async getAll(query: QueryPosts): Promise<Paginator<PostsViewModel>> {
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await PostsModel.countDocuments();
        const data = await PostsModel
            .find({},{_id:0,__v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .lean()
        return transformPagination<PostsViewModel>(data,pageSize,pageNumber,count)
    },
    async findById(id: string): Promise<PostsViewModel | null> {
        return PostsModel.findOne({id},{_id:0,__v:0}).lean()
    },
    async getPostsByBlogId(id: string, query: QueryPosts): Promise<Paginator<PostsViewModel>>{
        const filter = {blogId: id};
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await PostsModel.countDocuments(filter);
        const data = await PostsModel
            .find(filter,{_id:0, __v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .lean()
        return transformPagination<PostsViewModel>(data,pageSize,pageNumber,count)
    }
}