import {Request, Response, Router} from "express";
import {blogsRepository, postsRepository, videosRepository} from "../repositories";
import {Statuses} from "../types/types";

export const resetRouter = Router()

resetRouter.delete('/testing/all-data',(req:Request,res:Response)=>{
    postsRepository.deleteAll();
    blogsRepository.deleteAll();
    videosRepository.deleteAll();
    res.sendStatus(Statuses.NO_CONTENT)
})