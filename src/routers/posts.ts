import {Router} from "express";
import {
    basicAuthMiddleware,
    bearerAuthMiddleware,
    getUserMiddleware,
    sanitizationBody,
    validateMiddleware
} from "../middlewares";
import {postController} from "../controllers";
import {validateBodyPost, validatorBlogId, validatorBodyContent, validatorBodyLikes} from "../validations";
import {validatePaginationQuery, validateSortQuery} from "../validations/query";

const sanitizationBodyPosts = sanitizationBody(['title','shortDescription','content','blogId'])
const sanitizationBodyPostComment = sanitizationBody(['content'])
const validateBody = validateBodyPost(validatorBlogId)

const validateQuery = validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery
])

const validateBodyComment = validateMiddleware([validatorBodyContent])
const validateBodyLike = validateMiddleware([validatorBodyLikes])

export const postsRouter = Router({});

postsRouter.get('/',getUserMiddleware,validateQuery,postController.getPosts.bind(postController))
postsRouter.get('/:id',getUserMiddleware,postController.getPostOnId.bind(postController))
postsRouter.post('/',
    basicAuthMiddleware,
    sanitizationBodyPosts,
    validateBody,
    postController.createPost.bind(postController)
)
postsRouter.put('/:id',
    basicAuthMiddleware,
    sanitizationBodyPosts,
    validateBody,
    postController.updatePost.bind(postController)
)
postsRouter.delete('/:id',basicAuthMiddleware,postController.deletePost.bind(postController))
postsRouter.get('/:id/comments',
    getUserMiddleware,
    validateQuery,
    postController.getCommentByPost.bind(postController)
)
postsRouter.put('/:id/like-status',
    bearerAuthMiddleware,
    validateBodyLike,
    postController.updateStatusLike.bind(postController)
)
postsRouter.post(
    '/:id/comments',
    bearerAuthMiddleware,
    sanitizationBodyPostComment,
    validateBodyComment,
    postController.createCommentByPost.bind(postController)
)