import {Router} from "express";
import {basicAuthMiddleware, sanitizationBody, validateMiddleware} from "../middlewares";
import {createPost, deletePost, getPostOnId, getPosts, updatePost} from "../controllers/posts.controller";
import {validateBodyPost, validatorBlogId} from "../validations";
import {validatePaginationQuery, validateSortQuery} from "../validations/query";

const sanitizationBodyPosts = sanitizationBody(['title','shortDescription','content','blogId'])
const validateBody = validateBodyPost(validatorBlogId)

const validateQuery = validateMiddleware([
    ...validateSortQuery,
    ...validatePaginationQuery
])

export const postsRouter = Router({});

postsRouter.get('/',validateQuery,getPosts)
postsRouter.get('/:id',getPostOnId)
postsRouter.post('/',basicAuthMiddleware,sanitizationBodyPosts,validateBody,createPost)
postsRouter.put('/:id',basicAuthMiddleware,sanitizationBodyPosts,validateBody,updatePost)
postsRouter.delete('/:id',basicAuthMiddleware,deletePost)