import {Response} from "express";
import {inject, injectable} from "inversify";
import {RequestWithParams, RequestWithParamsAndBody, Statuses} from "../types/types";
import {CommentInputModel, CommentViewModel} from "../types/comments";
import {LikeInputModel} from "../types/likes";
import {CommentsQueryRepository} from "../repositories/query";
import {CommentsService} from "../services";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {}
    async getComments(req:RequestWithParams<{id: string}>,res:Response<CommentViewModel | Error>){
        try {
            const comment = await this.commentsQueryRepository.findById(req.params.id, req.user?.id)
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
    async updateComments(req:RequestWithParamsAndBody<{id: string},CommentInputModel>,res:Response){
        const comment = await this.commentsQueryRepository.findById(req.params.id);
        if(!comment){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        if(comment.commentatorInfo.userId !== req.user!.id){
            return res.sendStatus(Statuses.FORBIDDEN)
        }
        const isUpdated = await this.commentsService.update(req.params.id,req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async updateLikeAtComment(req: RequestWithParamsAndBody<{id: string},LikeInputModel>,res: Response){
        const comment = await this.commentsQueryRepository.findById(req.params.id);
        if(!comment){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        const isUpdated = await this.commentsService.updateLike(req.params.id, req.user?.id!, req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async deleteComments(req:RequestWithParams<{id: string}>,res:Response){
        const comment = await this.commentsQueryRepository.findById(req.params.id);
        if(!comment){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        if(comment.commentatorInfo.userId !== req.user!.id){
            return res.sendStatus(Statuses.FORBIDDEN)
        }
        const isDeleted = await this.commentsService.delete(req.params.id);
        if(!isDeleted){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
}