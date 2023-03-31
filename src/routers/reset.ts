import {Request, Response, Router} from "express";
import {
    blogsRepository,
    commentsRepository,
    postsRepository,
    usersRepository,
    videosRepository,
    securityRepository,
    commentsLikesRepository
} from "../repositories";
import {Statuses} from "../types/types";
import {postsLikesRepository} from "../repositories/postsLikes-db";

export const resetRouter = Router()

resetRouter.delete('/all-data',async (req:Request,res:Response)=>{
    await usersRepository.deleteAll();
    await postsRepository.deleteAll();
    await blogsRepository.deleteAll();
    await commentsRepository.deleteAll();
    await videosRepository.deleteAll();
    await securityRepository.deleteAll();
    await commentsLikesRepository.deleteAll();
    await postsLikesRepository.deleteAll();
    res.sendStatus(Statuses.NO_CONTENT)
})

resetRouter.delete('/sessions',async (req:Request,res:Response)=>{
    await securityRepository.deleteAll();
    res.sendStatus(Statuses.NO_CONTENT)
})