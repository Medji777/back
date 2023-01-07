import {Router,Request,Response} from "express";
import {videosRepository} from "../repositories/repo";

export const resetRouter = Router({});

resetRouter.delete('/testing/all-data',(req:Request,res:Response)=>{
    videosRepository.deleteAll();
    res.sendStatus(204)
})