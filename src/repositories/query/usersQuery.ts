import {UsersModel} from "../db";
import {Paginator, SortDirections} from "../../types/types";
import {getSortNumber} from "../../utils/sort";
import {transformPagination} from "../../utils/transform";
import {UserViewModel,UserModel,MeViewModel} from "../../types/users";

export type QueryUsers = {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: SortDirections,
    pageNumber: number,
    pageSize: number
}

const projectionFilter = {_id: 0, passwordHash: 0, emailConfirmation: 0, passwordConfirmation: 0, __v: 0}

export class UsersQueryRepository {
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
        const count = await UsersModel.countDocuments(filter);
        const items = await UsersModel
            .find(filter, projectionFilter)
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)
            .lean()
        return transformPagination<UserViewModel>(items,pageSize,pageNumber,count)
    }
    async getUserByLoginOrEmail(input: string): Promise<UserModel | null>{
        return UsersModel.findOne({$or:[{login: input},{email: input}]},{_id: 0,__v:0}).lean()
    }
    async getUserByUserId(userId: string): Promise<UserModel | null> {
        return UsersModel.findOne({id: userId}).lean();
    }
    async getUserByCode(code: string): Promise<UserModel | null> {
        return UsersModel.findOne({'emailConfirmation.confirmationCode': code}).lean();
    }
    async getUserByRecoveryCode(code: string): Promise<UserModel | null> {
        return UsersModel.findOne({'passwordConfirmation.confirmationCode': code}).lean();
    }
    async getMeProfile(userId: string): Promise<MeViewModel>{
        const user = await this.getUserByUserId(userId);
        return {
            email: user!.email,
            login: user!.login,
            userId: user!.id
        }
    }
}