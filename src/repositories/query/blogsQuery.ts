import {BlogsViewModel} from "../../types/blogs";
import {blogsCollection} from "../db";
import {Paginator, SortDirections} from "../../types/types";
import {transformPagination} from '../../utils/transform';
import {getSortNumber} from '../../utils/sort';

export type QueryBlogs = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: SortDirections,
    pageNumber: number,
    pageSize: number
}

export const blogsQueryRepository = {
    async getAll(query: QueryBlogs): Promise<Paginator<BlogsViewModel>> {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const filter = !searchNameTerm ? {} : {name:{$regex: new RegExp(searchNameTerm,'gi')}};
        const count = await blogsCollection.countDocuments(filter);
        const skipNumber = (pageNumber - 1) * pageSize;
        const data = await blogsCollection
            .find(filter,{projection: {_id:0}})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .toArray()
        return transformPagination<BlogsViewModel>(data,pageSize,pageNumber,count)
    },
    async findById(id: string): Promise<BlogsViewModel | null> {
        return blogsCollection.findOne({id},{projection: {_id:0}})
    },
}