import {Request, Response} from "express";
import {Paginator, RequestWithBody, RequestWithParams, Statuses} from "../types/types";
import {UserInputModel, UserViewModel} from "../types/users";
import {QueryUsers, usersQueryRepository} from "../repositories/query/usersQuery";
import {usersService} from "../domain";

class UsersController {
    async getUsers(req: Request, res: Response<Paginator<UserViewModel>>){
        const users = await usersQueryRepository.getAll(req.query as unknown as QueryUsers)
        res.status(Statuses.OK).send(users)
    }
    async createUser(req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>){
        const user = await usersService.createUser(req.body)
        res.status(Statuses.CREATED).send(user)
    }
    async deleteUser(req: RequestWithParams<{id: string}>, res: Response){
        const isDeleted = await usersService.deleteUser(req.params.id)
        if(!isDeleted){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async getUsersTest(req: Request, res: Response){
        const user = await usersQueryRepository.getUserByLoginOrEmail(req.body.email);
        if(!user){
            res.sendStatus(Statuses.NOT_FOUND)
        }
        res.status(Statuses.OK).send(user)
    }
}

export const usersController = new UsersController()