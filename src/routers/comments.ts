import {Router} from "express";
import {deleteComments, getComments, updateComments} from "../controllers/comments.controller";
import {bearerAuthMiddleware, validateMiddleware} from "../middlewares";
import {validatorBodyContent} from "../validations";

export const commentsRouter = Router({});
const validateBody = validateMiddleware([validatorBodyContent])

commentsRouter.get('/:id',getComments)
commentsRouter.put('/:id',bearerAuthMiddleware,validateBody,updateComments)
commentsRouter.delete('/:id',bearerAuthMiddleware,deleteComments)