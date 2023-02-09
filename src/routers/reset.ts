import {Request, Response, Router} from "express";
import {blogsRepository, commentsRepository, postsRepository, usersRepository, videosRepository} from "../repositories";
import {Statuses} from "../types/types";

export const resetRouter = Router()

resetRouter.delete('/all-data',async (req:Request,res:Response)=>{
    await usersRepository.deleteAll();
    await postsRepository.deleteAll();
    await blogsRepository.deleteAll();
    await commentsRepository.deleteAll();
    await videosRepository.deleteAll();
    res.sendStatus(Statuses.NO_CONTENT)
})