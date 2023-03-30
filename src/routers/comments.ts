import {Router} from "express";
import {deleteComments, getComments, updateComments, updateLikeAtComment} from "../controllers/comments.controller";
import {bearerAuthMiddleware, validateMiddleware, getUserMiddleware} from "../middlewares";
import {validatorBodyContent, validatorBodyLikes} from "../validations";

export const commentsRouter = Router({});
const validateBody = validateMiddleware([validatorBodyContent])
const validateBodyLike = validateMiddleware([validatorBodyLikes])

commentsRouter.get('/:id',getUserMiddleware,getComments)
commentsRouter.put('/:id',bearerAuthMiddleware,validateBody,updateComments)
commentsRouter.put('/:id/like-status',bearerAuthMiddleware,validateBodyLike,updateLikeAtComment)
commentsRouter.delete('/:id',bearerAuthMiddleware,deleteComments)