import {Router} from "express";
import {body} from "express-validator";
import {basicAuthMiddleware, sanitizationBody, validateMiddleware} from "../middlewares";
import {createPost, deletePost, getPostOnId, getPosts, updatePost} from "../controllers/posts.controller";

const sanitizationBodyPosts = sanitizationBody(['title','shortDescription','content','blogId'])
const validateBodyPost = validateMiddleware([
    body('title')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({max: 30}).withMessage('input is max length 30 symbol'),
    body('shortDescription')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({max: 100}).withMessage('input is max length 100 symbol'),
    body('content')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isLength({max: 1000}).withMessage('input is max length 1000 symbol'),
    body('blogId')
        .isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
])

export const postsRouter = Router({});

postsRouter.get('/posts',getPosts)
postsRouter.get('/posts/:id',getPostOnId)
postsRouter.post('/posts',basicAuthMiddleware,sanitizationBodyPosts,validateBodyPost,createPost)
postsRouter.put('/posts/:id',basicAuthMiddleware,sanitizationBodyPosts,validateBodyPost,updatePost)
postsRouter.delete('/posts/:id',basicAuthMiddleware,deletePost)