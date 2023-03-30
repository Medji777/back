import {Response} from "express";
import {commentsQueryRepository} from "../repositories/query";
import {commentsService} from "../domain/comments.service";
import {RequestWithParams, RequestWithParamsAndBody, Statuses} from "../types/types";
import {CommentInputModel, CommentViewModel} from "../types/comments";
import {LikeInputModel} from "../types/likes";

export const getComments = async (
    req:RequestWithParams<{id: string}>,
    res:Response<CommentViewModel | Error>) => {
    try {
        const comment = await commentsQueryRepository.findById(req.params.id, req.user?.id)
        if(!comment){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.status(Statuses.OK).send(comment)
    }
    catch (err) {
        const error = err as Error
        res.status(Statuses.INTERNAL_SERVER_ERROR).send(error)
    }
}

export const updateComments = async (
    req:RequestWithParamsAndBody<{id: string},CommentInputModel>,
    res:Response) => {
    const comment = await commentsQueryRepository.findById(req.params.id);
    if(!comment){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    if(comment.commentatorInfo.userId !== req.user!.id){
        return res.sendStatus(Statuses.FORBIDDEN)
    }
    const isUpdated = await commentsService.update(req.params.id,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const updateLikeAtComment = async (
    req: RequestWithParamsAndBody<{id: string},LikeInputModel>,
    res: Response) => {
    const comment = await commentsQueryRepository.findById(req.params.id);
    if(!comment){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    const isUpdated = await commentsService.updateLike(req.params.id, req.user?.id!, req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}

export const deleteComments = async (
    req:RequestWithParams<{id: string}>,
    res:Response) => {
    const comment = await commentsQueryRepository.findById(req.params.id);
    if(!comment){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    if(comment.commentatorInfo.userId !== req.user!.id){
        return res.sendStatus(Statuses.FORBIDDEN)
    }
    const isDeleted = await commentsService.delete(req.params.id);
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}