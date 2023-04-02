import {Router} from "express";
import {commentsController} from "../controllers";
import {bearerAuthMiddleware, validateMiddleware, getUserMiddleware} from "../middlewares";
import {validatorBodyContent, validatorBodyLikes} from "../validations";

export const commentsRouter = Router({});
const validateBody = validateMiddleware([validatorBodyContent])
const validateBodyLike = validateMiddleware([validatorBodyLikes])

commentsRouter.get('/:id',getUserMiddleware,commentsController.getComments)
commentsRouter.put('/:id',bearerAuthMiddleware,validateBody,commentsController.updateComments)
commentsRouter.put('/:id/like-status',bearerAuthMiddleware,validateBodyLike,commentsController.updateLikeAtComment)
commentsRouter.delete('/:id',bearerAuthMiddleware,commentsController.deleteComments)