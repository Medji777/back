import {Request, Response, Router} from "express";
import {blogsRepository, postsRepository, videosRepository} from "../repositories";
import {Statuses} from "../types/types";

export const resetRouter = Router()

resetRouter.delete('/testing/all-data',async (req:Request,res:Response)=>{
    await postsRepository.deleteAll();
    await blogsRepository.deleteAll();
    await videosRepository.deleteAll();
    res.sendStatus(Statuses.NO_CONTENT)
})