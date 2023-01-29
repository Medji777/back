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

postsRouter.get('/posts',validateQuery,getPosts)
postsRouter.get('/posts/:id',getPostOnId)
postsRouter.post('/posts',basicAuthMiddleware,sanitizationBodyPosts,validateBody,createPost)
postsRouter.put('/posts/:id',basicAuthMiddleware,sanitizationBodyPosts,validateBody,updatePost)
postsRouter.delete('/posts/:id',basicAuthMiddleware,deletePost)