import {Router} from "express";
import {commentsController} from "../composition-root";
import {bearerAuthMiddleware, getUserMiddleware} from "../middlewares";
import {validatorBodyContent, validatorBodyLikes} from "../validations";

export const commentsRouter = Router({});
const validateBody = validatorBodyContent
const validateBodyLike = validatorBodyLikes

commentsRouter.get('/:id',
    getUserMiddleware,
    commentsController.getComments.bind(commentsController)
)
commentsRouter.put('/:id',
    bearerAuthMiddleware,
    validateBody,
    commentsController.updateComments.bind(commentsController)
)
commentsRouter.put('/:id/like-status',
    bearerAuthMiddleware,
    validateBodyLike,
    commentsController.updateLikeAtComment.bind(commentsController)
)
commentsRouter.delete('/:id',
    bearerAuthMiddleware,
    commentsController.deleteComments.bind(commentsController)
)