import {Router} from "express";
import {deleteComments, getComments, updateComments} from "../controllers/comments.controller";
import {bearerAuthMiddleware} from "../middlewares";

export const commentsRouter = Router({});

commentsRouter.get('/:id',getComments)
commentsRouter.put('/:id',bearerAuthMiddleware,updateComments)
commentsRouter.delete('/:id',bearerAuthMiddleware,deleteComments)