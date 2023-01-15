import {Router} from "express";
import {body} from "express-validator";
import {basicAuthMiddleware,sanitizationBody,validateMiddleware} from "../middlewares";
import {createBlog, deleteBlog, getBlogOnId, getBlogs, updateBlog} from "../controllers/blogs.controller";

const sanitizationBodyBlogs = sanitizationBody(['name','description','websiteUrl'])
const validateBodyBlog = validateMiddleware([
    body('name')
        //.isString().withMessage('input is string')
        .trim().escape()
        .notEmpty().withMessage('input is required')
        .isLength({max: 15}).withMessage('input is max length 15 symbol'),
    body('description')
        //.isString().withMessage('input is string')
        .trim().escape()
        .notEmpty().withMessage('input is required')
        .isLength({max: 500}).withMessage('input is max length 500 symbol'),
    body('websiteUrl')
        //.isString().withMessage('input is string')
        .trim()
        .notEmpty().withMessage('input is required')
        .isURL({ protocols: ['https'] }).withMessage('input is URL')
        .isLength({max: 100}).withMessage('input is max length 100 symbol')
])

export const blogsRouter = Router({});

blogsRouter.get('/blogs',getBlogs)
blogsRouter.get('/blogs/:id',getBlogOnId)
blogsRouter.post('/blogs',basicAuthMiddleware,sanitizationBodyBlogs,validateBodyBlog,createBlog)
blogsRouter.put('/blogs/:id',basicAuthMiddleware,sanitizationBodyBlogs,validateBodyBlog,updateBlog)
blogsRouter.delete('/blogs/:id',basicAuthMiddleware,deleteBlog)