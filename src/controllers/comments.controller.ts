import {Response} from "express";
import {commentsQueryRepository} from "../repositories/query";
import {commentsService} from "../domain/comments.service";
import {RequestWithParams, RequestWithParamsAndBody, Statuses} from "../types/types";
import {CommentInputModel, CommentViewModel} from "../types/comments";

export const getComments = async (
    req:RequestWithParams<{id: string}>,
    res:Response<CommentViewModel>) => {
    const comment = await commentsQueryRepository.findById(req.params.id)
    if(!comment){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.status(Statuses.OK).send(comment)
}

export const updateComments = async (
    req:RequestWithParamsAndBody<{id: string},CommentInputModel>,
    res:Response) => {
    const isUpdated = await commentsService.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteComments = async (
    req:RequestWithParams<{id: string}>,
    res:Response) => {
    const isDeleted = await commentsService.delete(req.params.id);
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}