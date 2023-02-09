import {Router} from "express";
import {basicAuthMiddleware, bearerAuthMiddleware, sanitizationBody, validateMiddleware} from "../middlewares";
import {
    createCommentByPost,
    createPost,
    deletePost,
    getCommentByPost,
    getPostOnId,
    getPosts,
    updatePost
} from "../controllers/posts.controller";
import {validateBodyPost, validatorBlogId, validatorBodyContent} from "../validations";
import {validatePaginationQuery, validateSortQuery} from "../validations/query";

const sanitizationBodyPosts = sanitizationBody(['title','shortDescription','content','blogId'])
const sanitizationBodyPostComment = sanitizationBody(['content'])
const validateBody = validateBodyPost(validatorBlogId)

const validateQuery = validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery
])

const validateBodyComment = validateMiddleware([validatorBodyContent])

export const postsRouter = Router({});

postsRouter.get('/',validateQuery,getPosts)
postsRouter.get('/:id',getPostOnId)
postsRouter.post('/',basicAuthMiddleware,sanitizationBodyPosts,validateBody,createPost)
postsRouter.put('/:id',basicAuthMiddleware,sanitizationBodyPosts,validateBody,updatePost)
postsRouter.delete('/:id',basicAuthMiddleware,deletePost)
postsRouter.get('/:id/comments',validateQuery,getCommentByPost)
postsRouter.post(
    '/:id/comments',
    bearerAuthMiddleware,
    sanitizationBodyPostComment,
    validateBodyComment,
    createCommentByPost
)