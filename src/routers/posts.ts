import {Router} from "express";
import {
    basicAuthMiddleware,
    bearerAuthMiddleware,
    getUserMiddleware,
    sanitizationBody,
    validateMiddleware
} from "../middlewares";
import {container} from "../composition-root";
import {PostsController} from "../controllers";
import {validateBodyPost, validatorBlogId, validatorBodyContent, validatorBodyLikes} from "../validations";
import {validatePaginationQuery, validateSortQuery} from "../validations/query";

const sanitizationBodyPosts = sanitizationBody(['title','shortDescription','content','blogId'])
const sanitizationBodyPostComment = sanitizationBody(['content'])
const validateBody = validateBodyPost(validatorBlogId)

const validateQuery = validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery
])

const validateBodyComment = validatorBodyContent
const validateBodyLike = validatorBodyLikes

export const postsRouter = Router({});

const postController = container.resolve(PostsController)

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