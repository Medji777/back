import {Paginator, SortDirections} from "../../types/types";
import {PostsViewModel} from "../../types/posts";
import {getSortNumber} from "../../utils/sort";
import {postsCollection} from "../db";
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
        const count = await postsCollection.countDocuments();
        const data = await postsCollection
            .find({},{projection: {_id:0}})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .toArray()
        return transformPagination<PostsViewModel>(data,pageSize,pageNumber,count)
    },
    async findById(id: string): Promise<PostsViewModel | null> {
        return postsCollection.findOne({id},{projection: {_id:0}})
    },
    async getPostsByBlogId(id: string, query: QueryPosts): Promise<Paginator<PostsViewModel>>{
        const filter = {blogId: id};
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await postsCollection.countDocuments(filter);
        const data = await postsCollection
            .find(filter,{projection: {_id:0}})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .toArray()
        return transformPagination<PostsViewModel>(data,pageSize,pageNumber,count)
    }
}