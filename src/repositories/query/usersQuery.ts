import {usersCollection} from "../db";
import {Paginator, SortDirections} from "../../types/types";
import {getSortNumber} from "../../utils/sort";
import {transformPagination} from "../../utils/transform";
import {UserViewModel,UserModel} from "../../types/users";

export type QueryUsers = {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: SortDirections,
    pageNumber: number,
    pageSize: number
}

export const usersQueryRepository = {
    async getAll(query: QueryUsers): Promise<Paginator<UserViewModel>>{
        const arrayFilters = []
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        if(!!searchLoginTerm){
            arrayFilters.push({login: {$regex: new RegExp(searchLoginTerm,'gi')}})
        }
        if(!!searchEmailTerm){
            arrayFilters.push({email: {$regex: new RegExp(searchEmailTerm,'gi')}})
        }
        const filter = !arrayFilters.length ? {} : {$or:arrayFilters};
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await usersCollection.countDocuments(filter);
        const items = await usersCollection
            .find(filter,{projection: {_id:0, passwordHash: 0}})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .toArray()
        return transformPagination<UserViewModel>(items,pageSize,pageNumber,count)
    },
    async getUserByLoginOrEmail(input: string): Promise<UserModel | null>{
        return await usersCollection.findOne({$or:[{login: input},{email: input}]},{projection: {_id:0}})
    }
}