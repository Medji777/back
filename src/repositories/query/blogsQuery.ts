import {BlogsViewModel} from "../../types/blogs";
import {BlogsModel} from "../db";
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

export class BlogsQueryRepository {
    async getAll(query: QueryBlogs): Promise<Paginator<BlogsViewModel>> {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const filter = !searchNameTerm ? {} : {name:{$regex: new RegExp(searchNameTerm,'gi')}};
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await BlogsModel.countDocuments(filter);
        const data = await BlogsModel
            .find(filter,{_id:0,__v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .lean()
        return transformPagination<BlogsViewModel>(data,pageSize,pageNumber,count)
    }
    async findById(id: string): Promise<BlogsViewModel | null> {
        return BlogsModel.findOne({id},{_id:0,__v:0}).lean()
    }
}

export const blogsQueryRepository = new BlogsQueryRepository()